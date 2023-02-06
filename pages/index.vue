<script lang="ts" setup>
const language = ref('日本語')
const keyword = ref('')
const length = ref(200)
const feelings = ref('')
const str = computed(
  () => `
    ${language.value}で回答して下さい。「${keyword.value}」のキーワードを元に、文章を作成して下さい。文章は${length.value}文字前後にして下さい。随所に次の言葉を使用してください「私は非常にがっかりしました」「腹ただしいです。」「我慢なりません」「改善を求めます」
    `
)
const res = ref('')

const handleSubmit = async () => {
  const prompt = str.value
  const { data, error } = await useFetch(`/api/generate`, {
    method: 'POST',
    body: JSON.stringify({
      prompt,
    }),
  })

  if (error.value) {
    throw new Error(error.value.data.message)
  }
  feelings.value = data.value.choices[0].text
}
</script>

<template>
  <div class="artboard artboard-demo h-screen p-10">
    <h1 class="text-xl">お気持ち表明AI</h1>
    <div class="flex flex-col gap-3 mt-3">
      <label>
        言語
        <input type="text" class="input input-bordered" v-model="language" />
      </label>
      <label class="flex">
        キーワード
        <textarea
          type="text"
          class="textarea textarea-bordered w-60"
          v-model="keyword"
          placeholder=""
        ></textarea>
      </label>
      <label>
        文字数(目安)
        <input type="number" class="input input-bordered" v-model="length" />
      </label>
      <button type="button" @click="handleSubmit" class="btn">
        表明してもらう
      </button>
    </div>
    <h2 class="text-lg mt-8">お気持ち表明</h2>
    <div
      class="mt-4 border-solid border-orange-500 border-4 p-5"
      v-show="feelings"
    >
      {{ feelings }}
    </div>
  </div>
</template>
