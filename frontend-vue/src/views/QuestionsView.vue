<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { getQuestions } from "../api/questions"
import { getReviewQuestions } from "../api/review"
import { getSessions } from "../api/sessions"

type Question = {
  id: number
  body: string
  examSessionId: number
  questionNumber: number
  flagged: boolean
}

type Session = {
  id: number
  examYear: number
  examRound: number
}

type ReviewQuestion = {
  questionId: number
  questionNumber: number
  body: string
}

type QuestionListItem = {
  id: number
  body: string
  questionNumber: number
  examSessionId: number | null
}

const route = useRoute()
const router = useRouter()
const sessions = ref<Session[]>([])
const questions = ref<Question[]>([])
const reviewQuestions = ref<ReviewQuestion[]>([])
const loading = ref(true)
const errorMessage = ref("")
const reviewCount = ref(0)
const reviewLoading = ref(false)
const RANDOM_SOURCE_SIZE = 200
const RANDOM_PICK_SIZE = 50
const flaggedIds = ref<number[]>([])

function goDetail(id: number) {
  router.push({
    path: `/questions/${id}`,
    query: route.query,
  })
}

function logout() {
  localStorage.removeItem("userId")
  router.push("/register")
}

async function loadReviewCount() {
  try {
    const rawUserId = localStorage.getItem("userId")

    if (!rawUserId) {
      reviewCount.value = 0
      return
    }

    const parsedUserId = Number(rawUserId)

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      reviewCount.value = 0
      return
    }

    const res = await fetch(`http://localhost:3000/review/count?userId=${parsedUserId}`)

    if (!res.ok) {
      throw new Error("復習件数の取得に失敗しました")
    }

    const data = await res.json()
    reviewCount.value = typeof data.count === "number" ? data.count : 0
  } catch (error) {
    console.error(error)
    reviewCount.value = 0
  }
}

async function loadSessions() {
  try {
    const data = await getSessions()
    sessions.value = data.sessions
  } catch (error) {
    console.error(error)
    errorMessage.value = "回次の取得に失敗しました"
  }
}

async function loadReviewQuestions() {
  const rawUserId = localStorage.getItem("userId")

  if (!rawUserId) {
    reviewQuestions.value = []
    return
  }

  const parsedUserId = Number(rawUserId)

  if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
    reviewQuestions.value = []
    return
  }

  reviewLoading.value = true

  try {
    const data = await getReviewQuestions(parsedUserId)
    reviewQuestions.value = data.items
  } catch (error) {
    console.error(error)
    reviewQuestions.value = []
  } finally {
    reviewLoading.value = false
  }
}

async function loadQuestions() {
  try {
    const rawUserId = localStorage.getItem("userId")

    if (!rawUserId) {
      questions.value = []
      return
    }

    const parsedUserId = Number(rawUserId)

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      questions.value = []
      return
    }

    const data = await getQuestions(parsedUserId)
    questions.value = data.questions
  } catch (error) {
    console.error(error)
    errorMessage.value = "問題の取得に失敗しました"
  } finally {
    loading.value = false
  }
}

const sortedSessions = computed(() =>
  [...sessions.value].sort((a, b) => {
    if (a.examYear !== b.examYear) {
      return b.examYear - a.examYear
    }

    return b.examRound - a.examRound
  })
)

const latestSessionId = computed(() => sortedSessions.value[0]?.id ?? null)

const activeMode = computed(() =>
  route.query.mode === "review"
    ? "review"
    : route.query.mode === "random"
      ? "random"
      : "session"
)

const activeSessionId = computed(() => {
  const sessionId = Number(route.query.sessionId)

  if (Number.isInteger(sessionId) && sessions.value.some((session) => session.id === sessionId)) {
    return sessionId
  }

  return latestSessionId.value
})

const activeSession = computed(() =>
  sessions.value.find((session) => session.id === activeSessionId.value) ?? null
)

const activeListTitle = computed(() => {
  if (activeMode.value === "review") {
    return "復習対象の問題"
  }

  if (activeMode.value === "random") {
    return "ランダム問題"
  }

  if (activeSession.value) {
    return `第${activeSession.value.examRound}回`
  }

  return "問題一覧"
})

const isListLoading = computed(
  () => loading.value || (activeMode.value === "review" && reviewLoading.value)
)

const activeListDescription = computed(() => {
  if (activeMode.value === "review") {
    return "復習対象の問題だけを表示しています。"
  }

  if (activeMode.value === "random") {
    return `最新200問からランダムに選んだ最大${RANDOM_PICK_SIZE}問を表示しています。`
  }

  if (activeSession.value) {
    return `${activeSession.value.examYear}年 第${activeSession.value.examRound}回の問題です。`
  }

  return "表示できる問題がありません。"
})

const sessionQuestionCounts = computed(() => {
  const counts = new Map<number, number>()

  for (const question of questions.value) {
    counts.set(question.examSessionId, (counts.get(question.examSessionId) ?? 0) + 1)
  }

  return counts
})

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

function shuffleQuestions<T>(items: T[]) {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  return shuffled
}

const randomQuestionIds = computed(() => parseRandomQuestionIds(route.query.ids))

const displayedQuestions = computed<QuestionListItem[]>(() => {
  if (activeMode.value === "review") {
    return reviewQuestions.value.map((question) => {
      const originalQuestion = questions.value.find((item) => item.id === question.questionId)

      return {
        id: question.questionId,
        body: question.body,
        questionNumber: question.questionNumber,
        examSessionId: originalQuestion?.examSessionId ?? null,
      }
    })
  }

  if (activeMode.value === "random") {
    const questionsById = new Map(
      questions.value.map((question) => [question.id, question] as const)
    )

    return randomQuestionIds.value
      .map((questionId) => questionsById.get(questionId))
      .filter((question): question is Question => question !== undefined)
      .map((question) => ({
        id: question.id,
        body: question.body,
        questionNumber: question.questionNumber,
        examSessionId: question.examSessionId,
      }))
  }

  if (!activeSessionId.value) {
    return []
  }

  return questions.value
    .filter((question) => question.examSessionId === activeSessionId.value)
    .sort((a, b) => a.questionNumber - b.questionNumber)
    .map((question) => ({
      id: question.id,
      body: question.body,
      questionNumber: question.questionNumber,
      examSessionId: question.examSessionId,
    }))
})

function getSessionLabel(sessionId: number | null) {
  if (sessionId === null) return ""

  const session = sessions.value.find((item) => item.id === sessionId)
  return session ? `第${session.examRound}回` : ""
}

function selectSession(sessionId: number) {
  router.push({
    path: "/questions",
    query: { sessionId: String(sessionId) },
  })
}

function openReviewQuestions() {
  router.push({
    path: "/questions",
    query: { mode: "review" },
  })
}

function openRandomQuestions() {
  const sourceQuestions = [...questions.value]
    .sort((a, b) => b.id - a.id)
    .slice(0, RANDOM_SOURCE_SIZE)

  const selectedIds = shuffleQuestions(sourceQuestions)
    .slice(0, Math.min(RANDOM_PICK_SIZE, sourceQuestions.length))
    .map((question) => question.id)

  router.push({
    path: "/questions",
    query: {
      mode: "random",
      ids: selectedIds.join(","),
    },
  })
}

function isFlagged(questionId: number) {
  return questions.value.find((question) => question.id === questionId)?.flagged ?? false
}

async function loadFlaggedIds() {
  try {
    const rawUserId = localStorage.getItem("userId")

    if (!rawUserId) {
      flaggedIds.value = []
      return
    }

    const parsedUserId = Number(rawUserId)

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      flaggedIds.value = []
      return
    }

    const data = await getFlaggedQuestionIds(parsedUserId)
    flaggedIds.value = data.questionIds
  } catch (error) {
    console.error(error)
    flaggedIds.value = []
  }
}

watch(
  () => [route.query.mode, route.query.sessionId, route.query.ids, sortedSessions.value.length, questions.value.length],
  async ([mode]) => {
    if (mode === "review") {
      await loadReviewQuestions()
      return
    }

    if (mode === "random") {
      const ids = parseRandomQuestionIds(route.query.ids)
      const existingIds = new Set(questions.value.map((question) => question.id))
      const validIds = ids.filter((id) => existingIds.has(id))

      if (validIds.length === 0 && questions.value.length > 0) {
        openRandomQuestions()
      }

      return
    }

    if (!latestSessionId.value) return

    const sessionId = Number(route.query.sessionId)
    const isValidSession =
      Number.isInteger(sessionId) &&
      sessions.value.some((session) => session.id === sessionId)

    if (!isValidSession) {
      router.replace({
        path: "/questions",
        query: { sessionId: String(latestSessionId.value) },
      })
    }
  },
  { immediate: false }
)

onMounted(async () => {

    await Promise.all([
  loadSessions(),
  loadQuestions(),
  loadReviewCount(),
])

  if (route.query.mode === "review") {
    await loadReviewQuestions()
    return
  }

  if (route.query.mode === "random") {
    const ids = parseRandomQuestionIds(route.query.ids)

    if (ids.length === 0 && questions.value.length > 0) {
      openRandomQuestions()
    }

    return
  }

  if (latestSessionId.value && !route.query.sessionId) {
    router.replace({
      path: "/questions",
      query: { sessionId: String(latestSessionId.value) },
    })
  }
})
</script>

<template>
  <main class="page-shell">
    <section class="page-hero">
      <div class="page-hero-content questions-hero-content">
        <div>
          <p class="page-kicker">Quizwell</p>
          <h1 class="page-title">問題一覧</h1>
          <p class="page-subtitle">回次または復習一覧を選んで問題に取り組めます。</p>
        </div>

        <div class="hero-side-actions">
          <div class="hero-top-actions">
            <button class="button button-secondary" @click="logout">ログアウト</button>
          </div>

          <div class="selection-grid questions-selection-grid">
            <button
              v-for="session in sortedSessions"
              :key="session.id"
              :class="[
                'selection-card',
                { 'selection-card-active': activeMode === 'session' && activeSessionId === session.id },
              ]"
              @click="selectSession(session.id)"
            >
              <span class="selection-title">第{{ session.examRound }}回</span>
              <span class="selection-meta">{{ session.examYear }}年</span>
              <span class="selection-count">{{ sessionQuestionCounts.get(session.id) ?? 0 }}問</span>
            </button>

            <button
              :class="[
                'selection-card',
                { 'selection-card-active': activeMode === 'review' },
              ]"
              @click="openReviewQuestions"
            >
              <span class="selection-title">復習対象の問題</span>
              <span class="selection-meta">クリックで一覧へ</span>
              <span class="selection-count">{{ reviewCount }}問</span>
            </button>

            <button
              :class="[
                'selection-card',
                { 'selection-card-active': activeMode === 'random' },
              ]"
              @click="openRandomQuestions"
            >
              <span class="selection-title">ランダム問題</span>
              <span class="selection-meta">最新200問から50問を出題</span>
              <span class="selection-count">{{ Math.min(RANDOM_PICK_SIZE, questions.length) }}問</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="page-card">
      <div class="section-heading section-heading-split">
        <div>
          <p class="section-kicker">Questions</p>
          <h2>{{ activeListTitle }}</h2>
          <p class="section-description">{{ activeListDescription }}</p>
        </div>

        <div class="status-pill status-pill-soft">
          {{
            isListLoading
              ? "読み込み中..."
              : `全${displayedQuestions.length}問`
          }}
        </div>
      </div>

      <p v-if="errorMessage" class="message-banner message-banner-warning">
        {{ errorMessage }}
      </p>

      <div v-else-if="isListLoading" class="empty-state">
        <h3>読み込み中です</h3>
        <p>しばらくお待ちください。</p>
      </div>

      <div v-else-if="displayedQuestions.length === 0" class="empty-state">
        <h3>問題がありません</h3>
        <p>表示できる問題がありません。</p>
      </div>

      <ul v-else class="question-list">
        <li v-for="q in displayedQuestions" :key="q.id">
          <button class="question-card" @click="goDetail(q.id)">
            <div class="question-card-top">
<span class="question-index">
  <span style="margin-right: 6px;">
    {{ isFlagged(q.id) ? "★" : "☆" }}
  </span>

  <template v-if="activeMode !== 'session' && q.examSessionId !== null">
    {{ getSessionLabel(q.examSessionId) }} 問{{ q.questionNumber }}
  </template>
  <template v-else>
    問{{ q.questionNumber }}
  </template>
</span>
              <span class="question-arrow">詳細へ</span>
            </div>
            <p class="question-text">{{ q.body }}</p>
          </button>
        </li>
      </ul>
    </section>
  </main>
</template>
