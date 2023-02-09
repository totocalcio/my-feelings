import { OpenAIStreamPayload } from '../../utils/OpenAIStream'
import type { Data } from '../../utils/types'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OpenAIの環境変数が見つかりませんでした')
}
export const config = {
  runtime: 'edge',
}
export default defineEventHandler(async (event) => {
  const { prompt } = await readBody(event)
  if (!prompt) {
    return new Response('リクエストにプロンプトが含まれていません', {
      status: 400,
    })
  }
  const payload: OpenAIStreamPayload = {
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    n: 1,
  }

  const res = await $fetch('https://api.openai.com/v1/completions', {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
    },
    method: 'POST',
    body: payload,
  })

  return res
})
