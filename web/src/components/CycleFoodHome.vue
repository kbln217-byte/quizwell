<script setup lang="ts">
import type { CyclePhase, PhaseAdvice, PredictionCondition } from '../types/cycleFood'

defineProps<{
  phase: CyclePhase
  advice: PhaseAdvice
  due: {
    label: string
    value: string
    detail: string
  }
  cycleDay: number
  conditions: PredictionCondition[]
}>()

const emit = defineEmits<{
  openPhase: []
  openStatus: []
}>()
</script>

<template>
  <section class="cycle-home">
    <div class="cycle-summary-grid">
      <button class="cycle-summary-card cycle-summary-card-phase" type="button" @click="emit('openPhase')">
        <span>今日のフェーズ</span>
        <strong>{{ advice.shortLabel }}</strong>
      </button>
      <button class="cycle-summary-card cycle-summary-card-status" type="button" @click="emit('openStatus')">
        <span>{{ due.label }}</span>
        <strong>{{ due.value }}</strong>
      </button>
    </div>

    <section class="cycle-card meal-card">
      <span class="cycle-kicker">今日のおすすめ食事</span>
      <h2>フェーズに合わせたメニュー</h2>
      <div class="meal-list">
        <article>
          <span>朝</span>
          <strong>{{ advice.mealPlan.breakfast }}</strong>
        </article>
        <article>
          <span>昼</span>
          <strong>{{ advice.mealPlan.lunch }}</strong>
        </article>
        <article>
          <span>夜</span>
          <strong>{{ advice.mealPlan.dinner }}</strong>
        </article>
      </div>
      <p class="cycle-note">意識したい栄養素: {{ advice.nutrients.join('・') }}</p>
      <p class="cycle-reason">{{ advice.mealReason }}</p>
    </section>

    <section class="cycle-card">
      <span class="cycle-kicker">おすすめ購入アイテム</span>
      <h2>{{ advice.label }}に足しやすいもの</h2>
      <div class="purchase-list">
        <article v-for="item in advice.purchaseItems" :key="item.name">
          <strong>{{ item.name }}</strong>
          <p>{{ item.note }}</p>
        </article>
      </div>
    </section>

    <section class="cycle-card">
      <span class="cycle-kicker">予測コンディション</span>
      <h2>今日の肌・気分・体調</h2>
      <div class="condition-grid">
        <article v-for="condition in conditions" :key="condition.key">
          <span>{{ condition.label }}</span>
          <strong>{{ condition.value }}</strong>
          <p>{{ condition.detail }}</p>
        </article>
      </div>
    </section>
  </section>
</template>
