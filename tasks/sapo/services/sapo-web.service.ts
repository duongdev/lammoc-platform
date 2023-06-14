import { writeFileSync } from 'fs'
import { join } from 'path'

import type { Debugger } from 'debug'
import Debug from 'debug'
import type { Got } from 'got-cjs'
import got from 'got-cjs'
import { uniq } from 'lodash'

import { convertToHtml, getPlainProductInput } from 'tasks/openai/helpers'
import { generateProductDescription } from 'tasks/openai/openai'

import {
  SAPO_WEB_API_BASE_URL_PREFIX,
  SAPO_WEB_GPT_PROD_VENDOR_WHITELIST,
} from '../sapo.config'
import type { SapoTenant, SapoWebProduct } from '../sapo.type'

export class SapoWeb {
  private sapoWeb: Got
  private log: Debugger

  constructor(
    /* eslint-disable no-unused-vars */
    private readonly tenant: SapoTenant,
    private logger?: Debugger,
  ) {
    this.log = logger || Debug(`sapo-web:${tenant}`)

    const prefixUrl = SAPO_WEB_API_BASE_URL_PREFIX[tenant]

    if (!prefixUrl) {
      throw new Error('Tenant not found')
    }

    this.sapoWeb = got.extend({ prefixUrl })
  }

  async generateProductDescriptionByVendors() {
    const vendors = SAPO_WEB_GPT_PROD_VENDOR_WHITELIST
    const THREADS = +(process.env.THREADS || '1')
    const processors = Array.from(
      { length: THREADS },
      (_, i) =>
        ({ name: `Processor #${i}`, items: [], isWorking: false } as {
          name: string
          items: SapoWebProduct[]
          isWorking: boolean
        }),
    )
    /** Finished adding all products to processors */
    let finished = false

    const processThreads = () =>
      new Promise((resolve) => {
        const log = this.log.extend(
          `${this.generateProductDescriptionByVendors.name}:processThreads`,
        )
        const interval = setInterval(async () => {
          const isEmpty = processors.every(
            (processor) => !processor.items.length,
          )

          if (finished && isEmpty) {
            log('All threads finished. Exit!')
            clearInterval(interval)
            resolve(true)
          }

          for await (const processor of processors) {
            // Log status to file
            const filePath = join(
              __dirname,
              `./processors/${this.tenant}/${processor.name}.txt`,
            )

            writeFileSync(
              filePath,
              `isWorking: ${processor.isWorking}\nTotal items: ${
                processor.items.length
              }\n${processor.items
                .map((item) => `[${item.id}] ${item.name}`)
                .join('\n')}`,
            )

            if (processor.isWorking) {
              continue
            }

            const product = processor.items.shift()

            if (!product) {
              continue
            }

            processor.isWorking = true

            log(
              '[%s] Processing product: [%s] %s',
              processor.name,
              product.id,
              product.name,
            )

            try {
              await this.ensureSEOProductDescription(product)
              log(
                '[%s] Processed product: [%s] %s',
                processor.name,
                product.id,
                product.name,
              )
            } catch (error) {
              console.error(error)
              // Append to errors.txt file
              writeFileSync(
                join(__dirname, `./processors/${this.tenant}/errors.txt`),
                `[${product.id}] ${product.name}\n${error}\n=====\n`,
                { flag: 'a' },
              )
            }
            processor.isWorking = false
          }
        }, 1000)
      })

    processThreads()

    for await (const vendor of vendors) {
      const log = this.log.extend(
        `${this.generateProductDescriptionByVendors.name}`,
      )

      log('Start generating product description for vendor: %s', vendor)

      let currentPage = 1

      const paginate = this.sapoWeb.paginate<SapoWebProduct>('products.json', {
        searchParams: {
          vendor,
        },
        pagination: {
          paginate: ({ currentItems, response }) => {
            // If there are no more data, finish.
            if (currentItems.length === 0) {
              return false
            }

            currentPage += 1

            return {
              searchParams: {
                vendor,
                page: currentPage,
              },
            }
          },
          transform: (response: any) => {
            const body = JSON.parse((response as any).body)

            return body.products
          },
        },
      })

      for await (const product of paginate) {
        // log(`Processing product: [${product.id}] ${product.name}`)

        if (
          product.tags.split(', ').includes('SEO') &&
          !product.content.includes(`</ul>
<p>}</p>`)
        ) {
          // log(`[${product.id}] Product already have SEO tag. Skipped`)
          continue
        }

        // Add product to processor with less items
        const processor = processors.reduce((acc, cur) => {
          if (acc.items.length <= cur.items.length) {
            return acc
          }
          return cur
        })

        // log('Add product %s to processor: %s', product.name, processor.name)

        processor.items.push(product)
      }
    }

    finished = true
  }

  async ensureSEOProductDescription(product: SapoWebProduct) {
    const log = this.log.extend(this.ensureSEOProductDescription.name)
    log('updateProductContent')

    // Process OpenAI description
    const productInput = getPlainProductInput(
      product.name,
      product.content.trim(),
    )

    try {
      const generatedContent = await generateProductDescription(productInput)

      if (!generatedContent) {
        throw new Error('No generated content')
      }

      const htmlParse = convertToHtml(generatedContent as any)

      // Update description
      const updatedProduct = await this.sapoWeb
        .put(`products/${product.id}.json`, {
          json: {
            product: {
              id: product.id,
              content: htmlParse,
              tags: uniq([
                ...product.tags.split(', ').filter((t) => t !== 'GPT_ERR'),
                'SEO',
                'GPT_1.0.0',
              ]).join(', '),
              summary: generatedContent.shortDescription,
              meta_description: generatedContent.shortDescription,
            },
          },
        })
        .json()
        .catch((error) => {
          console.log(error.response.body)
        })

      return updatedProduct
    } catch (error) {
      // update GPT_ERR to tag
      await this.sapoWeb
        .put(`products/${product.id}.json`, {
          json: {
            product: {
              id: product.id,
              tags: uniq([...product.tags.split(', '), 'GPT_ERR']).join(', '),
            },
          },
        })
        .json()
        .catch((error) => {
          console.log(error.response.body)
        })

      throw error
    }
  }
}
