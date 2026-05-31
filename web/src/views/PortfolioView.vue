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
		<div class="works personal-works">
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
			<div class="card" @click="openApp('/cycle-food')">
				<h3>今日、何食べる？</h3>
				<img src="/cyclefood.png" />
				<p>
					女性の身体の周期に合わせて今日の食事アイデアを確認できるWebアプリ<br />
					（カレンダー・体調記録・傾向チェックまで実装）
				</p>
				<p>Vue / TypeScript</p>
				<a href="/cycle-food" target="_blank" @click.stop>サイトを見る</a>
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
	min-height: 100vh;
	width: 100%;
	padding: 56px 24px;
	text-align: center;

	background:
		linear-gradient(rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.82)), url("/IMAI.png");

	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
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
	align-items: stretch;
	gap: 24px;
	flex-wrap: wrap;
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

.personal-works .card {
	flex: 0 1 600px;
	max-width: 600px;
	min-width: 0;
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

.cycle-food-preview {
	width: 100%;
	height: 220px;
	display: grid;
	align-content: center;
	justify-items: center;
	gap: 12px;
	margin-bottom: 20px;
	border-radius: 12px;
	background:
		radial-gradient(circle at 20% 22%, rgba(255, 255, 255, 0.85), transparent 24%),
		radial-gradient(circle at 80% 28%, rgba(189, 236, 225, 0.78), transparent 28%),
		linear-gradient(135deg, #fff4fb 0%, #eef8ff 48%, #f6fff9 100%);
	color: #685f86;
	overflow: hidden;
}

.preview-kicker {
	color: #8193e8;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
}

.preview-title {
	font-size: 22px;
	font-weight: 800;
}

.preview-pill {
	padding: 8px 14px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.72);
	color: #786d97;
	font-size: 13px;
	font-weight: 700;
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

@media (max-width: 720px) {
	.personal-works .card {
		flex-basis: 100%;
		max-width: 600px;
	}
}
</style>
