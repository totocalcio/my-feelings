export type Data = {
  choices: { text: string }[]
  created: number
  id: string
  model: string
  object: string
  usage: {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }
}
