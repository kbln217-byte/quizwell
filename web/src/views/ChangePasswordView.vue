<script setup lang="ts">
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { buildApiUrl } from "../api/client"

const route = useRoute()
const router = useRouter()

const token = computed(() => String(route.query.token ?? ""))

const newPassword = ref("")
const confirmPassword = ref("")
const message = ref("")
const errorMessage = ref("")
const loading = ref(false)

async function handleSubmit() {
  message.value = ""
  errorMessage.value = ""

  if (!token.value) {
    errorMessage.value = "再設定URLが無効です"
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

  loading.value = true

  try {
    const res = await fetch(buildApiUrl("/users/auth/reset-password"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token.value,
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

    newPassword.value = ""
    confirmPassword.value = ""

    setTimeout(() => {
      router.push("/")
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
  <main class="page-shell">
    <section class="page-hero">
      <div class="page-hero-content">
        <div>
          <p class="page-kicker">Quizwell</p>
          <h1 class="page-title change-password-title">新しいパスワードを設定する</h1>
          <p class="page-subtitle">
            新しいパスワードを入力してください。
          </p>
        </div>
      </div>
    </section>

    <div class="page-grid change-password-grid">
      <section class="page-card">
        <div class="section-heading">
          <div>
            <p class="section-kicker">再設定</p>
            <h2>パスワード再設定</h2>
            <p class="section-description">
              新しいパスワードを設定すると、ログイン画面から再度ログインできます。
            </p>
          </div>
        </div>

        <form class="form-stack" @submit.prevent="handleSubmit">
          <div class="field">
            <span>新しいパスワード</span>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              class="input"
              required
            />
          </div>

          <div class="field">
            <span>新しいパスワード確認</span>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
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
              {{ loading ? "変更中..." : "パスワードを再設定する" }}
            </button>

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
.change-password-grid {
  grid-template-columns: minmax(0, 720px);
  justify-content: center;
}

.change-password-title {
  white-space: nowrap;
}

@media (max-width: 920px) {
  .change-password-title {
    white-space: normal;
  }

  .change-password-grid {
    grid-template-columns: 1fr;
  }
}
</style>