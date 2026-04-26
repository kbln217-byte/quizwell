<template>
	<div class="portfolio-page">
		<div class="hero">
			<h1>Wakaba Imai Portfolio</h1>
			<p class="subtitle">Vue / TypeScript を中心にしたWebアプリ開発（設計〜実装まで対応）</p>
		</div>

		<h2>チーム演習</h2>
		<div class="works">
			<div class="card" @click="openApp('http://35.77.89.102/login')">
				<h3>勤怠管理システム</h3>
				<img src="/attendance.png" />
				<p>
					従業員の打刻、休暇申請・承認、管理者機能を備えた勤怠管理アプリ<br />
					（認証・権限管理・承認フローまで実装）
				</p>
				<p>Vue / TypeScript / Express / Prisma / PostgreSQL</p>
				<a href="http://35.77.89.102/login" target="_blank" @click.stop>サイトを見る</a>
			</div>
		</div>

		<h2>個人演習</h2>
		<div class="works">
			<div class="card" @click="openApp('http://3.27.9.59/register')">
				<h3>キャリコン学科試験過去問集</h3>
				<img src="/career-quiz.png" />
				<p>
					キャリアコンサルタント試験の過去問学習を行えるWebアプリ<br />
					（過去問回答・ご回答記録・ブックマーク機能まで実装）
				</p>
				<p>Vue / TypeScript</p>
				<a href="http://3.27.9.59/register" target="_blank" @click.stop>サイトを見る</a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const openApp = (url: string) => {
	window.open(url, "_blank");
};
</script>

<style scoped>
.portfolio-page {
	max-width: 1000px;
	margin: 0 auto;
	padding: 56px 24px;
	text-align: center;
}

.hero {
	margin-bottom: 40px;
}

.hero h1 {
	font-size: 36px;
	font-weight: bold;
	margin-bottom: 8px;
}

.subtitle {
	color: #666;
	font-size: 14px;
}

h2 {
	margin-top: 40px;
	font-size: 22px;
}

.works {
	display: flex;
	justify-content: center;
	margin-top: 24px;
}

.card {
	width: 100%;
	max-width: 600px;
	padding: 24px;
	border-radius: 16px;
	background: #fff;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	transition: 0.3s;
	cursor: pointer;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card img {
	width: 100%;
	height: 220px;
	object-fit: cover;
	border-radius: 12px;
	margin-bottom: 20px;
}

.card p {
	font-size: 15px;
	line-height: 1.8;
}

.card a {
	display: inline-block;
	margin-top: 16px;
	padding: 10px 18px;
	border-radius: 999px;
	background: #2563eb;
	color: #fff;
	font-weight: bold;
	text-decoration: none;
}
</style>
