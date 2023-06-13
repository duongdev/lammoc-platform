import Debug from 'debug'
import type {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai'
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'

import type { GeneratedContent } from './helpers'
import { PRODUCT_DESCRIPTION_PROMPT_V1 } from './prompt'

export const generateProductDescription = async (product: {
  name: string
  description?: string
}): Promise<GeneratedContent | null> => {
  const debug = Debug('openai:generateProductDescription')

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  )

  const messages: ChatCompletionRequestMessage[] = [
    ...PRODUCT_DESCRIPTION_PROMPT_V1,
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: `${product.name}${
        product.description ? `\n${product.description}` : ''
      }`.trim(),
    },
  ]

  debug('', messages[messages.length - 1].content)
  debug('Generating...')

  try {
    let shouldContinue = true
    let data: CreateChatCompletionResponse
    let content: string = ''

    while (shouldContinue) {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        top_p: 1,
      })

      data = response.data

      debug('OpenAI response:', data)

      content += data.choices[0].message?.content ?? ''

      shouldContinue = data.choices[0].finish_reason !== 'stop'

      if (shouldContinue && data.choices[0].message) {
        messages.push(data.choices[0].message)

        debug('OpenAI is not finished, continue...')
      }
    }

    if (!content) {
      debug('Content is empty')
      return null
    }

    try {
      // Safe JSON parse
      const json = JSON.parse(
        content.replace(/[\n\r]+/g, '\n').trim(),
        (key, value) => {
          if (typeof value === 'string') {
            return value.trim()
          }

          return value
        },
      )

      return json
    } catch (error) {
      console.log(content)
      debug('JSON parse error:', error)
      return null
    }
  } catch (error: any) {
    debug('OpenAI error:', error.response?.data?.error)
    return null
  }
}
