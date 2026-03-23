<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { createUser } from "../api/users"

const router = useRouter()
const name = ref("")
const email = ref("")
const message = ref("")

async function submit() {
  try {
    const data = await createUser({
      name: name.value,
      email: email.value,
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
  <main style="max-width: 480px; margin: 40px auto;">
    <h1>ユーザー登録</h1>

    <input v-model="name" placeholder="名前" />
    <br /><br />
    <input v-model="email" placeholder="メール" />
    <br /><br />

    <button @click="submit">登録</button>

    <p>{{ message }}</p>
  </main>
</template>