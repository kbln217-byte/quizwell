<script setup lang="ts">
import { ref } from "vue"
import { buildApiUrl } from "../api/client"

const email = ref("")
const message = ref("")
const errorMessage = ref("")
const loading = ref(false)

async function handleSubmit() {
  message.value = ""
  errorMessage.value = ""
  loading.value = true

  try {
    const res = await fetch(buildApiUrl("/users/auth/forgot-password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
      }),
    })

    const data = await res.json()
console.log("forgot-password response:", data)
    if (!res.ok) {
      errorMessage.value =
        data?.error?.message ?? data?.message ?? "送信に失敗しました"
      return
    }

    message.value = data?.message ?? "再設定用の案内を送信しました"
    email.value = ""
  } catch (error) {
    console.error(error)
    errorMessage.value = "通信に失敗しました"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="page-card form-card forgot-password-card">
      <h1 class="forgot-password-title">パスワードを忘れた方へ</h1>
      <p class="forgot-password-subtitle">
        登録したメールアドレスを入力してください。
      </p>

      <form class="forgot-password-form" @submit.prevent="handleSubmit">
        <label class="forgot-password-label" for="email">メールアドレス</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="input"
          placeholder="example@example.com"
          required
        />

        <div class="button-row">
          <button type="submit" class="button button-primary" :disabled="loading">
            {{ loading ? "送信中..." : "送信" }}
          </button>
        </div>
      </form>

      <p v-if="message" class="forgot-password-message">
        {{ message }}
      </p>

      <p v-if="errorMessage" class="forgot-password-error">
        {{ errorMessage }}
      </p>
    </section>
  </main>
</template>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  padding: 48px 24px;
}

.forgot-password-card {
  max-width: 720px;
  margin: 0 auto;
}

.forgot-password-title {
  margin: 0 0 24px;
  font-size: 56px;
  font-weight: 700;
  color: #6b6793;
}

.forgot-password-subtitle {
  margin: 0 0 40px;
  font-size: 24px;
  color: #7a76a3;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.forgot-password-label {
  font-size: 24px;
  color: #7a76a3;
}

.forgot-password-input {
  width: 100%;
  max-width: 840px;
  padding: 22px 24px;
  font-size: 28px;
  border: 1px solid #bdbdbd;
  border-radius: 16px;
  box-sizing: border-box;
}

.forgot-password-button {
  width: 180px;
  margin-top: 24px;
  padding: 16px 24px;
  font-size: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.forgot-password-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.forgot-password-message {
  margin-top: 40px;
  font-size: 22px;
  color: #7a76a3;
}

.forgot-password-error {
  margin-top: 20px;
  font-size: 22px;
  color: #d64545;
}
</style>