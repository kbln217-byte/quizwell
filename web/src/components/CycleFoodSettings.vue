<script setup lang="ts">
defineProps<{
  averageCycleLength: number
  periodHistoryCount: number
}>()
</script>

<template>
  <section class="cycle-card settings-card" aria-label="周期設定">
    <div class="settings-header">
      <span class="cycle-kicker">設定</span>
      <h2>周期設定</h2>
      <p>日々の記録は、カレンダーの日付を選んで入力できます。</p>
    </div>

    <div class="settings-summary" aria-live="polite">
      <span>入力履歴から自動計算された平均周期</span>
      <strong>{{ averageCycleLength }}日</strong>
    </div>

    <div class="settings-guide">
      <h3>記録方法</h3>
      <p>
        カレンダーで日付をタップし、モーダル内の生理開始日・生理終了日を選ぶと周期計算に反映されます。
      </p>
      <span>周期計算に使える履歴: {{ periodHistoryCount }}件</span>
    </div>
  </section>
</template>
