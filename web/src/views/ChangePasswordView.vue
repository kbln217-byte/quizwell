<script setup lang="ts">
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { buildApiUrl } from "../api/client"

const router = useRouter()

const token = computed(() => localStorage.getItem("token") ?? "")

const currentPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")
const message = ref("")
const errorMessage = ref("")
const loading = ref(false)

async function handleSubmit() {
  message.value = ""
  errorMessage.value = ""

  if (!token.value) {
    errorMessage.value = "ログイン情報がありません"
    return
  }

  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = "すべて入力してください"
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "新しいパスワード確認が一致しません"
    return
  }

  loading.value = true

  try {
    const res = await fetch(buildApiUrl("/users/me/password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      errorMessage.value =
        data?.error?.message ?? data?.message ?? "パスワード変更に失敗しました"
      return
    }

    message.value = data?.message ?? "パスワードを変更しました"

    currentPassword.value = ""
    newPassword.value = ""
    confirmPassword.value = ""

    setTimeout(() => {
      router.push("/questions")
    }, 1500)
  } catch (error) {
    console.error(error)
    errorMessage.value = "通信に失敗しました"
  } finally {
    loading.value = false
  }
}


</script>

<template>
  <main style="padding: 24px; max-width: 480px; margin: 0 auto;">
    <h1>パスワード変更</h1>

    <form @submit.prevent="handleSubmit" style="display: grid; gap: 12px; margin-top: 16px;">
      <div>
        <label for="currentPassword">現在のパスワード</label>
        <input
          id="currentPassword"
          v-model="currentPassword"
          type="password"
          style="display: block; width: 100%; padding: 8px; margin-top: 4px;"
          required
        />
      </div>

      <div>
        <label for="newPassword">新しいパスワード</label>
        <input
          id="newPassword"
          v-model="newPassword"
          type="password"
          style="display: block; width: 100%; padding: 8px; margin-top: 4px;"
          required
        />
      </div>

      <div>
        <label for="confirmPassword">新しいパスワード確認</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          style="display: block; width: 100%; padding: 8px; margin-top: 4px;"
          required
        />
      </div>

      <button type="submit" :disabled="loading" class="button button-primary">
        {{ loading ? "変更中..." : "パスワードを変更する" }}
      </button>

      <p v-if="message" style="color: green;">{{ message }}</p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>

      <router-link to="/questions" class="button button-secondary">
        メイン画面に戻る
      </router-link>
    </form>
  </main>
</template>