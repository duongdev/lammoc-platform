import type { Debugger } from 'debug'
import Debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'

import { convertToHtml, getPlainProductInput } from 'tasks/openai/helpers'
import { generateProductDescription } from 'tasks/openai/openai'

import { SAPO_WEB_KEY, SAPO_WEB_SECRET } from '../sapo-web.config'
import type { SapoProductItem } from '../sapo.type'
import type { PaginationInput } from '../sapo.util'
import { getPaginationOptions } from '../sapo.util'

export class SapoWeb {
  private sapoWeb: Got
  private log: Debugger

  constructor(
    /* eslint-disable no-unused-vars */
    private readonly sapoWebKey: string = SAPO_WEB_KEY!,
    private readonly sapoWebSecret: string = SAPO_WEB_SECRET!,
    private logger?: Debugger,
  ) {
    this.log = logger || Debug('sapo-web')

    this.sapoWeb = got.extend({
      prefixUrl:
        'https://f26c8a56a9914c068d98f65edec0fc0c:13f6751ed6cc491ebc63e7435d3972c1@store-lam-moc.mysapo.net/admin',
    })
  }
  async ensureSEOProductDescription(product: SapoProductItem) {
    const log = this.log.extend(this.ensureSEOProductDescription.name)
    log('updateProductContent')

    // Find first product have not tag SEO
    const isSEO =
      product.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((t) => t === 'SEO').length === 1

    if (!isSEO) {
      // Process OpenAI description
      const productInput = getPlainProductInput(
        product.name,
        product.description.trim(),
      )

      const generatedContent = await generateProductDescription(productInput)

      if (!generatedContent) {
        console.log('No generated content')

        // update GPT_ERR to tag
        const updatedProduct = await this.sapoWeb
          .put(`products/#${product.id}.json`, {
            json: { tags: [...product.tags, 'GPT_ERR'] },
          })
          .catch((error) => {
            console.log(error.response.body)
          })
        return updatedProduct
      }

      const htmlParse = convertToHtml(generatedContent)

      // Update description
      const updatedProduct = await this.sapoWeb
        .put(`products/#${product.id}.json`, {
          json: {
            description: htmlParse,
            tags: [...product.tags, 'SEO'],
          },
        })
        .catch((error) => {
          console.log(error.response.body)
        })

      return updatedProduct
    }
    return
  }

  // TODO: chạy song song, config được thread
  async syncSEOProductDescription(options?: PaginationInput) {
    const paginate = this.sapoWeb.paginate<SapoProductItem>(
      'products.json',
      getPaginationOptions(options),
    )

    // filter category
    for await (const product of paginate) {
      console.log('>>>> ~ SapoWeb ~ forawait ~ product:', product)
      // this.ensureSEOProductDescription(product)
    }
  }
}
