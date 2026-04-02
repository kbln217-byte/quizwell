<template>
  <main class="page-shell">
    <section class="page-hero">
      <div class="page-hero-content">
        <div>
          <p class="page-kicker">Quizwell</p>
          <h1 class="page-title">送信しました</h1>
          <p class="page-subtitle">
            パスワード再設定の案内を送信しました。
          </p>
        </div>
      </div>
    </section>

    <div class="page-grid forgot-password-sent-grid">
      <section class="page-card">
        <div class="section-heading">
          <div>
            <p class="section-kicker">完了</p>
            <h2>メールをご確認ください</h2>
            <p class="section-description">
              メール内のURLから新しいパスワードを設定してください。
            </p>
          </div>
        </div>

        <div class="button-row">
          <router-link to="/" class="button button-primary">
            ログイン画面に戻る
          </router-link>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.forgot-password-sent-grid {
  grid-template-columns: minmax(0, 720px);
  justify-content: center;
}
</style>