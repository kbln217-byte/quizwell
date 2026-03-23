<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getQuestionById } from "../api/questions"
import { submitAnswer } from "../api/answers"

type Choice = {
  id: number
  label: string
  text: string
  isCorrect: boolean
}

type Question = {
  id: number
  examSessionId: number
  questionNumber: number
  body: string
  explanation: string | null
  choices: Choice[]
}

const route = useRoute()
const router = useRouter()

const question = ref<Question | null>(null)
const loading = ref(true)
const errorMessage = ref("")
const selectedChoiceId = ref<number | null>(null)

const resultMessage = ref("")
const isCorrect = ref<boolean | null>(null)
const selectedChoiceText = ref("")
const correctChoiceText = ref("")

async function loadQuestion(id: string) {
  loading.value = true
  errorMessage.value = ""
  resultMessage.value = ""
  selectedChoiceId.value = null
  selectedChoiceText.value = ""
  correctChoiceText.value = ""
  isCorrect.value = null

  try {
    const data = await getQuestionById(id)
    question.value = data.question
  } catch (error) {
    console.error(error)
    errorMessage.value = "問題詳細の取得に失敗しました"
    question.value = null
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (typeof newId === "string") {
      loadQuestion(newId)
    }
  },
  { immediate: true }
)

async function answerQuestion() {
  try {
    resultMessage.value = ""
    isCorrect.value = null
    selectedChoiceText.value = ""
    correctChoiceText.value = ""

    if (!question.value) {
      resultMessage.value = "問題データがありません"
      return
    }

    if (selectedChoiceId.value === null) {
      resultMessage.value = "選択肢を選んでください"
      return
    }

    const rawUserId = localStorage.getItem("userId")

    if (!rawUserId) {
      resultMessage.value = "先にユーザー登録をしてください"
      return
    }

    const parsedUserId = Number(rawUserId)

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      resultMessage.value = "保存されたuserIdが不正です"
      return
    }

    const res = await submitAnswer({
      userId: parsedUserId,
      questionId: question.value.id,
      selectedChoiceId: selectedChoiceId.value,
    })

    isCorrect.value = res.answer.isCorrect
    selectedChoiceText.value = res.answer.selectedChoice.text
    resultMessage.value = res.answer.isCorrect ? "正解です" : "不正解です"

    if (!res.answer.isCorrect && question.value) {
      const correctChoice = question.value.choices.find((choice) => choice.isCorrect)
      correctChoiceText.value = correctChoice ? correctChoice.text : ""
    }
  } catch (error) {
    console.error(error)
    resultMessage.value =
      error instanceof Error ? error.message : "回答送信に失敗しました"
  }
}

function goBack() {
  if (!question.value) return

  const prevId = question.value.id - 1
  if (prevId < 1) return

  router.push(`/questions/${prevId}`)
}

function goNext() {
  if (!question.value) return

  const nextId = question.value.id + 1
  router.push(`/questions/${nextId}`)
}

function goToList() {
  router.push("/questions")
}
</script>

<template>
  <main style="padding: 24px">
    <p v-if="loading">読み込み中...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

    <div v-else-if="question">
      <h1>問題詳細</h1>
      <p><strong>問題 {{ question.questionNumber }}</strong></p>
      <p>{{ question.body }}</p>

      <h2>選択肢</h2>
      <ul style="list-style: none; padding: 0;">
        <li
          v-for="choice in question.choices"
          :key="choice.id"
          style="margin-bottom: 12px;"
        >
          <label>
            <input
              type="radio"
              name="choice"
              :value="choice.id"
              v-model="selectedChoiceId"
            />
            {{ choice.label }}. {{ choice.text }}
          </label>
        </li>
      </ul>

      <button @click="answerQuestion">回答する</button>

      <div v-if="resultMessage" style="margin-top: 16px;">
        <p>{{ resultMessage }}</p>
        <p v-if="selectedChoiceText">あなたの回答: {{ selectedChoiceText }}</p>
        <p v-if="correctChoiceText">正解: {{ correctChoiceText }}</p>
      </div>

      <div v-if="isCorrect !== null" style="margin-top: 16px;">
        <button @click="goToList">一覧に戻る</button>
        <button @click="goBack" style="margin-left: 8px;">前の問題へ</button>
        <button @click="goNext" style="margin-left: 8px;">次の問題へ</button>
      </div>
    </div>
  </main>
</template>
