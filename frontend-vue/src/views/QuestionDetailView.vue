<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getQuestionById, getQuestions } from "../api/questions"
import { submitAnswer } from "../api/answers"
import { getReviewQuestions } from "../api/review"

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
const correctChoiceLabel = ref("")
const correctChoiceText = ref("")
const navigationQuestionIds = ref<number[]>([])

const hasAnswered = computed(() => isCorrect.value !== null)
const feedbackClassName = computed(() => {
  if (isCorrect.value === true) return "feedback-panel feedback-panel-correct"
  if (isCorrect.value === false) return "feedback-panel feedback-panel-incorrect"
  return "feedback-panel feedback-panel-neutral"
})
const currentQuestionIndex = computed(() => {
  if (!question.value) return -1
  return navigationQuestionIds.value.findIndex((id) => id === question.value?.id)
})
const canGoBack = computed(() => currentQuestionIndex.value > 0)
const canGoNext = computed(
  () =>
    currentQuestionIndex.value >= 0 &&
    currentQuestionIndex.value < navigationQuestionIds.value.length - 1
)

function parseRandomQuestionIds(idsQuery: unknown) {
  const rawIds =
    typeof idsQuery === "string"
      ? idsQuery
      : Array.isArray(idsQuery)
        ? idsQuery.join(",")
        : ""

  return rawIds
    .split(",")
    .map((value) => Number(value))
    .filter((value, index, array) =>
      Number.isInteger(value) && value > 0 && array.indexOf(value) === index
    )
}

async function loadNavigationContext() {
  if (route.query.mode === "review") {
    const rawUserId = localStorage.getItem("userId")

    if (!rawUserId) {
      navigationQuestionIds.value = []
      return
    }

    const parsedUserId = Number(rawUserId)

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      navigationQuestionIds.value = []
      return
    }

    try {
      const data = await getReviewQuestions(parsedUserId)
      navigationQuestionIds.value = data.items.map((item: { questionId: number }) => item.questionId)
    } catch (error) {
      console.error(error)
      navigationQuestionIds.value = []
    }

    return
  }

  if (route.query.mode === "random") {
    navigationQuestionIds.value = parseRandomQuestionIds(route.query.ids)
    return
  }

  try {
    const data = await getQuestions()
    const sessionId = Number(route.query.sessionId)
    const questions = Array.isArray(data.questions) ? data.questions : []
    const filteredQuestions =
      Number.isInteger(sessionId) && sessionId > 0
        ? questions
            .filter((item: { examSessionId: number }) => item.examSessionId === sessionId)
            .sort(
              (a: { questionNumber: number }, b: { questionNumber: number }) =>
                a.questionNumber - b.questionNumber
            )
        : questions.sort((a: { id: number }, b: { id: number }) => a.id - b.id)

    navigationQuestionIds.value = filteredQuestions.map((item: { id: number }) => item.id)
  } catch (error) {
    console.error(error)
    navigationQuestionIds.value = []
  }
}

async function loadPage(id: string) {
  await Promise.all([loadQuestion(id), loadNavigationContext()])
}

async function loadQuestion(id: string) {
  loading.value = true
  errorMessage.value = ""
  resultMessage.value = ""
  selectedChoiceId.value = null
  selectedChoiceText.value = ""
  correctChoiceLabel.value = ""
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
  () => [route.params.id, route.query.mode, route.query.sessionId, route.query.ids],
  ([newId]) => {
    if (typeof newId === "string") {
      loadPage(newId)
    }
  },
  { immediate: true }
)

async function answerQuestion() {
  try {
    resultMessage.value = ""
    isCorrect.value = null
    selectedChoiceText.value = ""
    correctChoiceLabel.value = ""
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
      correctChoiceLabel.value = correctChoice ? correctChoice.label : ""
      correctChoiceText.value = correctChoice ? correctChoice.text : ""
    }
  } catch (error) {
    console.error(error)
    resultMessage.value =
      error instanceof Error ? error.message : "回答送信に失敗しました"
  }
}

function goBack() {
  if (!canGoBack.value) return

  const prevId = navigationQuestionIds.value[currentQuestionIndex.value - 1]

  router.push({
    path: `/questions/${prevId}`,
    query: route.query,
  })
}

function goNext() {
  if (!canGoNext.value) return

  const nextId = navigationQuestionIds.value[currentQuestionIndex.value + 1]

  router.push({
    path: `/questions/${nextId}`,
    query: route.query,
  })
}

function goToList() {
  router.push({
    path: "/questions",
    query: route.query,
  })
}
</script>

<template>
  <main class="page-shell">
    <div v-if="loading" class="page-card empty-state">
      <h3>問題を読み込み中です</h3>
      <p>少しだけお待ちください。</p>
    </div>

    <p v-else-if="errorMessage" class="message-banner message-banner-warning">
      {{ errorMessage }}
    </p>

    <div v-else-if="question" class="page-grid">
      <section class="page-card">
        <div class="section-heading">
          <p class="section-kicker">Question</p>
          <h2>問題 {{ question.questionNumber }}</h2>
        </div>

        <p class="question-statement">{{ question.body }}</p>

        <div class="subtle-divider"></div>

        <div class="section-heading">
          <p class="section-kicker">Choices</p>
          <h2>選択肢</h2>
        </div>

        <ul class="choice-list">
          <li v-for="choice in question.choices" :key="choice.id">
            <label
              :class="[
                'choice-card',
                { 'choice-card-selected': selectedChoiceId === choice.id },
              ]"
            >
              <input
                v-model="selectedChoiceId"
                type="radio"
                name="choice"
                :value="choice.id"
              />
              <span class="choice-pill">{{ choice.label }}</span>
              <span class="choice-copy">{{ choice.text }}</span>
            </label>
          </li>
        </ul>

        <div class="button-row">
          <button class="button button-secondary" @click="goToList">一覧に戻る</button>
          <button class="button button-primary" @click="answerQuestion">回答する</button>
        </div>

        <div v-if="resultMessage" :class="feedbackClassName">
          <p class="feedback-title">{{ resultMessage }}</p>
          <p v-if="selectedChoiceText" class="feedback-line">
            あなたの回答: {{ selectedChoiceText }}
          </p>
          <p v-if="correctChoiceText" class="feedback-line">
            正解: {{ correctChoiceLabel }}. {{ correctChoiceText }}
          </p>
        </div>

        <div v-if="hasAnswered" class="button-row">
          <button class="button button-ghost" :disabled="!canGoBack" @click="goBack">
            前の問題へ
          </button>
          <button class="button button-primary" :disabled="!canGoNext" @click="goNext">
            次の問題へ
          </button>
        </div>
      </section>

      <section v-if="hasAnswered && question.explanation" class="page-card">
        <div class="section-heading">
          <p class="section-kicker">Explanation</p>
          <h2>解説</h2>
        </div>

        <p class="body-copy">{{ question.explanation }}</p>
      </section>
    </div>
  </main>
</template>
