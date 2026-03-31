<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { createUser } from "../api/users"

const router = useRouter()
const email = ref("")
const password = ref("")
const message = ref("")

async function submit() {
  try {
    message.value = ""

    const trimmedEmail = email.value.trim()
    const trimmedPassword = password.value.trim()

    if (!trimmedEmail || !trimmedPassword) {
      message.value = "メールアドレスとパスワードを入力してください"
      return
    }

    if (trimmedPassword.length < 8) {
      message.value = "パスワードは8文字以上で入力してください"
      return
    }

    const data = await createUser({
      email: trimmedEmail,
      password: trimmedPassword,
    })

    console.log("users response:", data)

    const savedUserId =
      data?.user?.id ??
      data?.id ??
      data?.createdUser?.id

    if (!savedUserId || Number(savedUserId) <= 0) {
      message.value = "userIdの保存に失敗しました"
      return
    }

    localStorage.setItem("userId", String(savedUserId))
    console.log("saved userId:", localStorage.getItem("userId"))

    router.push("/questions")
  } catch (e) {
    console.error(e)
    message.value = e instanceof Error ? e.message : "登録失敗"
  }
}
</script>

<template>
  <main class="page-shell">
    <section class="page-hero register-panel">
      <div class="page-hero-content">
        <div>
          <p class="page-kicker">Quizwell</p>
          <h1 class="page-title register-title">
            <span class="register-title-part">キャリコン</span>
            <span class="register-title-part">学科試験過去問</span>
          </h1>
          <p class="page-subtitle">
            キャリアコンサルタントの試験は3月、7月、11月です。<br />
            申し込みの締め切りは試験の3か月前です。
          </p>
        </div>
      </div>
    </section>

    <section class="page-card form-card register-panel">
      <div class="section-heading">
        <p class="section-kicker">Register</p>
        <h2>ユーザー登録</h2>
        <p class="section-description">メールアドレスとパスワードで登録します。</p>
      </div>

      <div class="form-stack">
        <label class="field">
          <span>メールアドレス</span>
          <input
            v-model="email"
            class="input"
            type="email"
            placeholder="例: XXXX@example.com"
          />
        </label>

        <label class="field">
          <span>パスワード</span>
          <input
            v-model="password"
            class="input"
            type="password"
            placeholder="4文字以上のパスワード"
          />
        </label>
      </div>

      <div class="button-row">
        <button class="button button-primary" @click="submit">
          進む
        </button>
      </div>

      <p v-if="message" class="message-banner message-banner-warning">{{ message }}</p>
    </section>
  </main>
</template>
