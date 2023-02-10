<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Data } from '../utils/types'
import type { _AsyncData } from 'nuxt/dist/app/composables/asyncData'

const colorMode = useColorMode()
colorMode.preference = 'winter'

const language = ref('日本語')
const keyword = ref('')
const length = ref(300)
const feelings = ref('')
const str = computed(
  () => `
    ${language.value}で回答して下さい。「${keyword.value}」のキーワードを元に、文章を作成して下さい。文章は${length.value}文字前後にして下さい。随所に次の言葉を使用してください。「私は非常にがっかりしました」「腹ただしいです。」「我慢なりません」「改善を求めます」。全ての言葉を使用する必要はありません。
    `
)
const isLoading = ref(false)

const handleSubmit = async (e: any) => {
  e.preventDefault()
  isLoading.value = true

  const prompt = str.value
  const { data, error } = (await useAsyncData(() =>
    globalThis.$fetch('/api/generate', {
      method: 'POST',
      body: {
        prompt,
      },
    })
  )) as { data: Ref<Data | null>; error?: Ref<Error | null> }

  if (error?.value) {
    feelings.value =
      'エラーが発生しました。気持ちを落ち着かせて再度表明して下さい。'
    console.error(error.value.message)
    isLoading.value = false
    return
  }

  if (!data.value) {
    feelings.value =
      '予期せぬエラーが発生しました。後ほど改めてお気持ちを表明して下さい。'
    isLoading.value = false
    return
  }
  feelings.value = data.value.choices[0].text
  isLoading.value = false
}
</script>

<template>
  <div class="container">
    <h1 class="text-xl text-center mb-8">お気持ち表明AI</h1>
    <div class="row">
      <label for="language">言語</label>
      <input
        id="language"
        type="text"
        class="input input-bordered"
        v-model="language"
      />
    </div>
    <div class="row">
      <label class="flex" for="keyword">キーワード</label>
      <textarea
        id="keyword"
        type="text"
        class="textarea textarea-bordered"
        v-model="keyword"
        placeholder=""
      ></textarea>
    </div>
    <button type="button" @click="handleSubmit" class="btn w-80 button">
      表明してもらう
    </button>
    <div v-if="isLoading">
      <div class="flex justify-center items-center mt-2">
        <span class="mr-2">表明中</span>
        <div class="animate-ping h-1 w-1 bg-blue-600 rounded-full"></div>
        <div class="animate-ping h-1 w-1 bg-blue-600 rounded-full mx-4"></div>
        <div class="animate-ping h-1 w-1 bg-blue-600 rounded-full"></div>
      </div>
    </div>
    <div
      class="mt-4 border-solid border-orange-500 border-4 p-5"
      v-show="feelings"
    >
      {{ feelings }}
    </div>
  </div>
</template>

<style lang="scss">
.container {
  padding: 4rem;
  margin-inline: auto;
  width: min(100%, 640px);
  @media (width <= 460px) {
    padding: 1em;
  }
}

.row {
  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  &:not(:last-of-type) {
    margin-bottom: 1rem;
  }
  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
    &:not(:last-of-type) {
      margin-bottom: 0.5rem;
    }
  }
}

label {
  @container (width <= 640px) {
    margin-bottom: 0.5rem;
  }
}

.button {
  display: block;
  margin-inline: auto;
  margin-top: 2rem;
}
</style>
