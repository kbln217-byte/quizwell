<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const registerEmail = ref("")
const registerPassword = ref("")
const loginEmail = ref("")
const loginPassword = ref("")
const registerMessage = ref("")
const loginMessage = ref("")
const registerLoading = ref(false)
const loginLoading = ref(false)
const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function submitRegister() {
  registerMessage.value = ""
  registerLoading.value = true

  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail.value,
        password: registerPassword.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      registerMessage.value = data?.error?.message ?? data?.message ?? "新規登録に失敗しました"
      return
    }

    registerMessage.value = "新規登録に成功しました"
    router.push("/questions")
  } catch (error) {
    console.error(error)
    registerMessage.value = "通信に失敗しました"
  } finally {
    registerLoading.value = false
  }
}

async function submitLogin() {
  loginMessage.value = ""
  loginLoading.value = true

  try {
    const res = await fetch(`${BASE_URL}/users/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail.value,
        password: loginPassword.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      loginMessage.value = data?.error?.message ?? data?.message ?? "ログインに失敗しました"
      return
    }

    loginMessage.value = "ログイン成功"
    router.push("/questions")
  } catch (error) {
    console.error(error)
    loginMessage.value = "通信に失敗しました"
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="page-hero">
      <div class="page-hero-content">
        <div>
          <p class="page-kicker">Quizwell</p>
          <h1 class="page-title register-title">
            <span class="title-part title-part-first">キャリコン</span>
            <span class="title-part title-part-second">学科試験過去問</span>
          </h1>
          <p class="page-subtitle">
            キャリアコンサルタントの試験は3月、7月、11月です。<br>
申し込みの締め切りは試験の3か月前です。
          </p>
        </div>
      </div>
    </section>

    <div class="page-grid register-action-grid">
      <section class="page-card">
        <div class="section-heading">
          <div>
            <p class="section-kicker">新規作成</p>
            <h2>アカウントを作成</h2>
            <p class="section-description">
              過去問学習をはじめるために、まずは新しいアカウントを作成してください。
            </p>
          </div>
        </div>

        <form class="form-stack" @submit.prevent="submitRegister">
          <div class="field">
            <span>メールアドレス</span>
            <input
              id="register-email"
              v-model="registerEmail"
              type="email"
              placeholder="例: user@example.com"
              class="input"
              required
            />
          </div>

          <div class="field">
            <span>パスワード</span>
            <input
              id="register-password"
              v-model="registerPassword"
              type="password"
              placeholder="4文字以上のパスワード"
              class="input"
              required
            />
          </div>

          <div class="button-row">
            <button type="submit" class="button button-primary" :disabled="registerLoading">
              {{ registerLoading ? '送信中...' : '新規登録' }}
            </button>
          </div>
        </form>

        <p v-if="registerMessage" class="message-banner message-banner-warning">
          {{ registerMessage }}
        </p>
      </section>

      <section class="page-card">
        <div class="section-heading">
          <div>
            <p class="section-kicker">ログイン</p>
            <h2>既存アカウント</h2>
            <p class="section-description">
              既に登録済みの方はこちらからログインして、問題演習に進んでください。
            </p>
          </div>
        </div>

        <form class="form-stack" @submit.prevent="submitLogin">
          <div class="field">
            <span>メールアドレス</span>
            <input
              id="login-email"
              v-model="loginEmail"
              type="email"
              placeholder="例: user@example.com"
              class="input"
              required
            />
          </div>

          <div class="field">
            <span>パスワード</span>
            <input
              id="login-password"
              v-model="loginPassword"
              type="password"
              placeholder="4文字以上のパスワード"
              class="input"
              required
            />
          </div>

          <div class="button-row">
            <button type="submit" class="button button-primary" :disabled="loginLoading">
              {{ loginLoading ? '送信中...' : 'ログイン' }}
            </button>
          </div>
        </form>

        <p class="section-description" style="margin-top: 16px;">
          <router-link to="/forgot-password">PWを忘れた方へ</router-link>
        </p>

        <p v-if="loginMessage" class="message-banner message-banner-warning">
          {{ loginMessage }}
        </p>
      </section>
    </div>
  </main>
</template>

<style scoped>
.register-action-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.register-title {
  white-space: nowrap;
}

@media (max-width: 920px) {
  .register-action-grid {
    grid-template-columns: 1fr;
  }

  .register-title {
    white-space: normal;
  }

  .register-title .title-part {
    display: block;
  }
}
</style>