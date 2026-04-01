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
    <section class="page-hero">
      <div class="page-hero-content">
        <div>
          <p class="page-kicker">Quizwell</p>
          <h1 class="page-title forgot-password-title">パスワードを忘れた方へ</h1>
          <p class="page-subtitle">
            登録したメールアドレスを入力してください。
          </p>
        </div>
      </div>
    </section>

    <div class="page-grid forgot-password-grid">
      <section class="page-card">
        <div class="section-heading">
          <div>
            <p class="section-kicker">再設定</p>
            <h2>メールアドレスを送信</h2>
            <p class="section-description">
              登録済みのメールアドレス宛に、パスワード再設定の案内を送信します。
            </p>
          </div>
        </div>

        <form class="form-stack" @submit.prevent="handleSubmit">
          <div class="field">
            <span>メールアドレス</span>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="例: user@example.com"
              class="input"
              required
            />
          </div>

          <div class="button-row">
            <button
              type="submit"
              class="button button-primary"
              :disabled="loading"
            >
              {{ loading ? "送信中..." : "送信" }}
            </button>

<router-link to="/change-password" class="button button-primary">
  新しいパスワードを設定する
</router-link>

          <router-link to="/" class="button button-secondary">
      ログイン画面に戻る
    </router-link>

  </div>
</form>



        <p v-if="message" class="message-banner message-banner-success">
          {{ message }}
        </p>

        <p v-if="errorMessage" class="message-banner message-banner-warning">
          {{ errorMessage }}
        </p>

      </section>

      




    </div>
  </main>
</template>



<style scoped>
.forgot-password-grid {
  grid-template-columns: minmax(0, 720px);
  justify-content: center;
}

.forgot-password-title {
  white-space: nowrap;
}

@media (max-width: 920px) {
  .forgot-password-title {
    white-space: normal;
  }

  .forgot-password-grid {
    grid-template-columns: 1fr;
  }
}
</style>