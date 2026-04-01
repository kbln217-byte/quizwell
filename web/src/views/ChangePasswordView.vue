<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { buildApiUrl } from "../api/client"

const route = useRoute()
const router = useRouter()

const token =
  typeof route.query.token === "string" ? route.query.token : ""

const newPassword = ref("")
const confirmPassword = ref("")
const message = ref("")
const errorMessage = ref("")
const loading = ref(false)

async function handleSubmit() {
  message.value = ""
  errorMessage.value = ""

  if (!token) {
    errorMessage.value = "無効なURLです"
    return
  }

  if (!newPassword.value || !confirmPassword.value) {
    errorMessage.value = "すべて入力してください"
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = "新しいパスワード確認が一致しません"
    return
  }

  const res = await fetch(buildApiUrl("/users/auth/reset-password"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      password: newPassword.value,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    errorMessage.value =
      data?.error?.message ?? data?.message ?? "パスワード再設定に失敗しました"
    return
  }

  message.value = data?.message ?? "パスワードを再設定しました"

  setTimeout(() => {
    router.push("/register")
  }, 1500)
}
</script>

<template>
  <main style="padding: 24px; max-width: 480px; margin: 0 auto;">
    <h1>パスワード再設定</h1>

    <form @submit.prevent="handleSubmit" style="display: grid; gap: 12px; margin-top: 16px;">
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

      <button type="submit" :disabled="loading" style="padding: 10px 16px;">
        {{ loading ? "変更中..." : "パスワードを再設定する" }}
      </button>

      <p v-if="message" style="color: green;">{{ message }}</p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </form>
  </main>
</template>