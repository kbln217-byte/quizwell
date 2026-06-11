<template>
	<div class="portfolio-page">
		<div class="hero">
			<h1>Wakaba Imai Portfolio</h1>
			<p class="subtitle">Vue / TypeScript を中心にしたWebアプリ開発・設計・実装までの制作記録</p>
		</div>

		<h2>チーム演習</h2>
		<div class="works">
			<div class="card" @click="openApp('http://35.77.89.102/login')">
				<h3>勤怠管理システム</h3>
				<img src="/attendance.png" alt="勤怠管理システムの画面" />
				<p>
					従業員の打刻、休暇申請、承認、管理機能を備えた勤怠管理アプリ。<br />
					認証・権限管理・承認フローまで実装しました。
				</p>
				<p class="tech-stack">Vue / TypeScript / Express / Prisma / PostgreSQL</p>
				<a href="http://35.77.89.102/login" target="_blank" @click.stop>サイトを見る</a>
			</div>
		</div>

		<h2>個人演習</h2>
		<div class="works personal-works">
			<div class="card" @click="openApp('http://3.27.9.59/register')">
				<h3>キャリコン学科試験過去問集</h3>
				<img src="/career-quiz.png" alt="キャリコン学科試験過去問集の画面" />
				<p>
					キャリアコンサルタント試験の過去問学習を行えるWebアプリ。<br />
					過去問回答、回答記録、ブックマーク機能まで実装しました。
				</p>
				<p class="tech-stack">Vue / TypeScript</p>
				<a href="http://3.27.9.59/register" target="_blank" @click.stop>サイトを見る</a>
			</div>

			<div class="card career-pass-card" @click="openApp('http://127.0.0.1:5173/register')">
				<h3>キャリコンPASS</h3>
				<div class="career-pass-preview" aria-hidden="true">
					<span class="career-pass-kicker">CAREER CONSULTANT</span>
					<span class="career-pass-title">キャリコンPASS</span>
					<span class="career-pass-screen">過去問 / 復習 / 弱点対策</span>
				</div>
				<p>
					キャリアコンサルタント試験の学習を、登録から問題演習、復習まで進められるWebアプリ。<br />
					quizwellをベースに、キャリコン学習向けの新しい環境として構築しました。
				</p>
				<p class="tech-stack">Vue / TypeScript / Express / Prisma / PostgreSQL</p>
				<a href="http://127.0.0.1:5173/register" target="_blank" @click.stop>サイトを見る</a>
			</div>

			<div class="card" @click="openApp('/cycle-food-app/')">
				<h3>今日、何食べる？</h3>
				<img src="/cyclefood.png" alt="今日、何食べる？の画面" />
				<p>
					女性の身体の周期に合わせて、今日の食事アイデアを確認できるWebアプリ。<br />
					カレンダー、体調記録、傾向チェックまで実装しました。
				</p>
				<p class="tech-stack">Vue / TypeScript</p>
				<a href="/cycle-food-app/" target="_blank" @click.stop>サイトを見る</a>
			</div>

			<div class="card bug-arcade-card" @click="openApp('/bug-arcade/')">
				<h3>BUG ARCADE</h3>
				<div class="bug-arcade-preview" aria-hidden="true">
					<span class="arcade-kicker">BUG HUNTING</span>
					<span class="arcade-title">BUG ARCADE</span>
					<span class="arcade-screen">Bug Buster / slashBUG</span>
				</div>
				<p>
					Vue + TypeScriptで制作したミニゲーム集。<br />
					クリック操作で遊べるブラウザゲームを公開。
				</p>
				<p class="tech-stack">Vue / TypeScript / Vite / SVG</p>
				<a href="/bug-arcade/" target="_blank" @click.stop>サイトを見る</a>
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

.personal-works {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	width: min(1180px, 100%);
	margin-inline: auto;
}

.card {
	width: 100%;
	max-width: 600px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	border-radius: 16px;
	background: #fff;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	transition: 0.3s;
	cursor: pointer;
}

.personal-works .card {
	max-width: none;
	min-width: 0;
}

.card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card img,
.bug-arcade-preview,
.career-pass-preview {
	width: 100%;
	height: 220px;
	border-radius: 12px;
	margin-bottom: 20px;
}

.card img {
	object-fit: cover;
}

.bug-arcade-preview {
	display: grid;
	align-content: center;
	justify-items: center;
	gap: 10px;
	position: relative;
	overflow: hidden;
	border: 3px solid #18302c;
	background:
		radial-gradient(circle at 74% 20%, rgba(255, 206, 74, 0.9), transparent 24%),
		radial-gradient(circle at 18% 78%, rgba(123, 217, 182, 0.72), transparent 22%),
		linear-gradient(135deg, #14192d, #223f7a 52%, #0f8f7f);
	color: #fffef5;
	box-shadow: inset 0 -10px 0 rgba(24, 48, 44, 0.3);
}

.bug-arcade-preview::before {
	content: "";
	position: absolute;
	inset: 18px;
	border: 2px dashed rgba(255, 255, 255, 0.42);
	border-radius: 10px;
}

.arcade-kicker,
.arcade-title,
.arcade-screen {
	position: relative;
}

.arcade-kicker {
	color: #ffce4a;
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.18em;
}

.arcade-title {
	font-size: clamp(26px, 3vw, 34px);
	font-weight: 900;
	line-height: 1;
	text-shadow: 4px 4px 0 rgba(24, 48, 44, 0.9);
}

.arcade-screen {
	padding: 8px 14px;
	border: 2px solid rgba(255, 255, 255, 0.72);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.14);
	font-size: 13px;
	font-weight: 800;
}

.career-pass-preview {
	display: grid;
	align-content: center;
	justify-items: center;
	gap: 12px;
	position: relative;
	overflow: hidden;
	border: 1px solid #d8e2f2;
	background:
		linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(238, 247, 255, 0.82)),
		linear-gradient(135deg, #1768ac, #16a085 58%, #f2c94c);
	color: #102033;
}

.career-pass-preview::before {
	content: "";
	position: absolute;
	inset: 18px;
	border: 1px solid rgba(23, 104, 172, 0.26);
	border-radius: 10px;
}

.career-pass-kicker,
.career-pass-title,
.career-pass-screen {
	position: relative;
}

.career-pass-kicker {
	color: #1768ac;
	font-size: 12px;
	font-weight: 900;
	letter-spacing: 0.14em;
}

.career-pass-title {
	font-size: clamp(24px, 3vw, 32px);
	font-weight: 900;
	line-height: 1.15;
}

.career-pass-screen {
	padding: 8px 14px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.7);
	color: #24605a;
	font-size: 13px;
	font-weight: 800;
}

.card p {
	font-size: 15px;
	line-height: 1.8;
}

.tech-stack {
	color: #4f5f78;
	font-weight: 700;
}

.card a {
	display: inline-block;
	align-self: center;
	margin-top: auto;
	padding: 10px 18px;
	border-radius: 999px;
	background: #2563eb;
	color: #fff;
	font-weight: bold;
	text-decoration: none;
}

@media (max-width: 1000px) {
	.personal-works {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 720px) {
	.portfolio-page {
		padding: 40px 16px;
	}

	.personal-works {
		grid-template-columns: 1fr;
	}
}
</style>
