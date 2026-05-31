<script setup lang="ts">
import type { CyclePhase } from '../types/cycleFood'

defineProps<{
  trends: Array<{
    phase: CyclePhase
    label: string
    hasEnoughRecords: boolean
    body: string[]
    skin: string[]
    mood: string[]
  }>
}>()
</script>

<template>
  <section class="cycle-card trends-card">
    <h2>時期ごとの出やすさ</h2>
    <div class="trend-grid">
      <article v-for="trend in trends" :key="trend.phase" class="trend-card">
        <h3>{{ trend.label }}</h3>
        <p v-if="!trend.hasEnoughRecords" class="trend-empty">
          記録が増えると傾向が見えてきます。
        </p>
        <div v-else class="trend-groups">
          <div>
            <span>体調</span>
            <p>{{ trend.body.join(' / ') || '記録なし' }}</p>
          </div>
          <div>
            <span>肌</span>
            <p>{{ trend.skin.join(' / ') || '記録なし' }}</p>
          </div>
          <div>
            <span>気分</span>
            <p>{{ trend.mood.join(' / ') || '記録なし' }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
