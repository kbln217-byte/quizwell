<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { getQuestions } from "../api/questions"


type Question = {
  id: number
  body: string
}

const router = useRouter()
const questions = ref<Question[]>([])
const loading = ref(true)
const errorMessage = ref("")
const reviewCount = ref(0);

function goDetail(id: number) {
  router.push(`/questions/${id}`)
}

onMounted(async () => {
  const res = await fetch("http://localhost:3000/review/count?userId=2");
  const data = await res.json();
  reviewCount.value = data.count;
});

onMounted(async () => {
  try {
    const data = await getQuestions()
    questions.value = data.questions
  } catch (error) {
    console.error(error)
    errorMessage.value = "問題の取得に失敗しました"
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main style="padding: 24px">
    <h1>問題一覧</h1>

    <p v-if="loading">読み込み中...</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>

<p>復習対象：{{ reviewCount }}問</p>

<p v-if="questions.length === 0">問題がありません</p>

<ul v-else>
  <li
    v-for="q in questions"
    :key="q.id"
    @click="goDetail(q.id)"
    style="cursor: pointer; margin-bottom: 12px;"
  >
    {{ q.body }}
  </li>
</ul>

  </main>
</template>