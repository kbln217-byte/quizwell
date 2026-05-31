<script setup lang="ts">
import { computed, ref } from 'vue'
import CycleFoodCalendar from '../components/CycleFoodCalendar.vue'
import CycleFoodHome from '../components/CycleFoodHome.vue'
import CycleFoodSettings from '../components/CycleFoodSettings.vue'
import CycleFoodTrends from '../components/CycleFoodTrends.vue'
import DailyLogModal from '../components/DailyLogModal.vue'
import { useCycleFood } from '../composables/useCycleFood'

const {
  activeView,
  selectedDate,
  dailyRecords,
  todayKey,
  currentPhase,
  currentCycleDay,
  averageCycleLength,
  periodHistory,
  periodDue,
  todayAdvice,
  todayConditions,
  periodDateKeys,
  predictedPeriodDateKeys,
  getCalendarDates,
  formatDateKey,
  getLog,
  saveLog,
  getDatePhase,
  trends,
} = useCycleFood()

const detailModal = ref<'phase' | 'status' | null>(null)
const isLogOpen = ref(false)

const selectedLog = computed(() => getLog(selectedDate.value))

function openLog(date: string) {
  selectedDate.value = date
  isLogOpen.value = true
}
</script>

<template>
  <main class="cycle-food-shell">
    <h1 class="sr-only">Cycle Food</h1>

    <CycleFoodHome
      v-if="activeView === 'home'"
      :phase="currentPhase"
      :advice="todayAdvice"
      :due="periodDue"
      :cycle-day="currentCycleDay"
      :conditions="todayConditions"
      @open-phase="detailModal = 'phase'"
      @open-status="detailModal = 'status'"
    />

    <CycleFoodCalendar
      v-else-if="activeView === 'calendar'"
      :selected-date="selectedDate"
      :today-key="todayKey"
      :records="dailyRecords"
      :period-date-keys="periodDateKeys"
      :predicted-period-date-keys="predictedPeriodDateKeys"
      :get-calendar-dates="getCalendarDates"
      :format-date-key="formatDateKey"
      :get-date-phase="getDatePhase"
      @select="openLog"
      @change-month="selectedDate = $event"
    />

    <CycleFoodTrends v-else-if="activeView === 'trends'" :trends="trends" />

    <CycleFoodSettings
      v-else
      :average-cycle-length="averageCycleLength"
      :period-history-count="periodHistory.length"
    />

    <nav class="cycle-bottom-nav" aria-label="Cycle Food navigation">
      <button
        type="button"
        :class="{ active: activeView === 'home' }"
        @click="activeView = 'home'"
      >
        ホーム
      </button>
      <button
        type="button"
        :class="{ active: activeView === 'calendar' }"
        @click="activeView = 'calendar'"
      >
        カレンダー
      </button>
      <button
        type="button"
        :class="{ active: activeView === 'trends' }"
        @click="activeView = 'trends'"
      >
        あなたの傾向
      </button>
      <button
        type="button"
        :class="{ active: activeView === 'settings' }"
        @click="activeView = 'settings'"
      >
        設定
      </button>
    </nav>

    <DailyLogModal
      v-if="isLogOpen"
      :log="selectedLog"
      @save="saveLog"
      @close="isLogOpen = false"
    />

    <div v-if="detailModal" class="cycle-modal" role="presentation" @mousedown.self="detailModal = null">
      <section class="cycle-modal-panel info-panel" role="dialog" aria-modal="true">
        <button class="cycle-modal-close" type="button" aria-label="閉じる" @click="detailModal = null">×</button>
        <template v-if="detailModal === 'phase'">
          <h2>{{ todayAdvice.label }}</h2>
          <p>{{ todayAdvice.summary }}</p>
        </template>
        <template v-else>
          <h2>周期ステータス</h2>
          <p>周期{{ currentCycleDay }}日目です。</p>
          <p>{{ periodDue.detail }}</p>
          <p>入力された周期からの目安です。体調や周期のズレによる可能性もあります。</p>
        </template>
      </section>
    </div>
  </main>
</template>

<style>
.cycle-food-shell {
  --cf-bg: #fffaf6;
  --cf-bg-soft: #f8fcf9;
  --cf-surface: #ffffff;
  --cf-surface-soft: #fffaf6;
  --cf-text: #655955;
  --cf-heading: #2e2523;
  --cf-muted: #8b6f67;
  --cf-border: #ece3dd;
  --cf-border-warm: #ead8d0;
  --cf-rose: #e98c83;
  --cf-rose-strong: #9d5544;
  --cf-rose-soft: #f9ece6;
  --cf-mint: #74b99b;
  --cf-blue: #7fa6d8;
  --cf-amber: #e3ae55;
  --cf-shadow: 0 10px 28px rgba(72, 55, 45, 0.06);
  position: relative;
  width: 100%;
  min-height: 100svh;
  margin: 0 auto;
  padding: 12px 12px 92px;
  color: var(--cf-text);
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background:
    linear-gradient(180deg, rgba(255, 246, 241, 0.92), rgba(248, 252, 249, 0.96)),
    var(--cf-bg);
  box-shadow: 0 0 0 100vmax var(--cf-bg);
  clip-path: inset(0 -100vmax);
}

.cycle-food-shell > .cycle-home,
.cycle-food-shell > .cycle-calendar-card,
.cycle-food-shell > .trends-card,
.cycle-food-shell > .settings-card {
  width: min(100%, 720px);
  margin-inline: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.cycle-food-shell button,
.cycle-food-shell input,
.cycle-food-shell textarea,
.cycle-food-shell select {
  font: inherit;
}

.cycle-home {
  display: grid;
  gap: 10px;
}

.cycle-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.cycle-summary-card {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 104px;
  padding: 14px 12px;
  overflow: hidden;
  border: 1px solid var(--cf-border);
  border-radius: 8px;
  background: var(--cf-surface);
  color: var(--cf-heading);
  text-align: left;
  box-shadow: var(--cf-shadow);
}

.cycle-summary-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: var(--cf-rose);
}

.cycle-summary-card-status::before {
  background: var(--cf-mint);
}

.cycle-summary-card span,
.cycle-kicker {
  color: var(--cf-muted);
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.2;
}

.cycle-summary-card strong {
  align-self: center;
  color: var(--cf-heading);
  font-size: clamp(1.12rem, 5.2vw, 1.34rem);
  line-height: 1.22;
}

.cycle-card,
.cycle-calendar-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--cf-border);
  border-radius: 8px;
  background: var(--cf-surface);
  box-shadow: var(--cf-shadow);
}

.cycle-card h2,
.cycle-calendar-card h2 {
  color: var(--cf-heading);
  font-size: 1.15rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.meal-list,
.purchase-list,
.condition-grid {
  display: grid;
  gap: 10px;
}

.meal-list article,
.purchase-list article,
.condition-grid article {
  display: grid;
  gap: 5px;
  padding: 12px;
  border: 1px solid var(--cf-border-warm);
  border-radius: 8px;
  background: var(--cf-surface-soft);
}

.meal-list span,
.condition-grid span {
  color: var(--cf-rose-strong);
  font-size: 0.78rem;
  font-weight: 800;
}

.meal-list strong,
.purchase-list strong,
.condition-grid strong {
  color: var(--cf-heading);
  line-height: 1.45;
}

.purchase-list p,
.condition-grid p,
.cycle-note {
  color: var(--cf-text);
  font-size: 0.9rem;
}

.cycle-reason {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--cf-rose-soft);
  color: #7a5147;
  font-size: 0.9rem;
  font-weight: 700;
}

.calendar-header {
  display: grid;
  grid-template-columns: 64px 1fr 64px;
  align-items: center;
  gap: 8px;
}

.calendar-header button,
.log-chip {
  min-height: 40px;
  border: 1px solid var(--cf-border-warm);
  border-radius: 8px;
  background: var(--cf-surface-soft);
  color: var(--cf-muted);
  font-weight: 800;
}

.calendar-header h2 {
  text-align: center;
}

.calendar-weekdays,
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.calendar-weekdays span {
  color: var(--cf-muted);
  font-size: 0.72rem;
  font-weight: 800;
  text-align: center;
}

.calendar-day {
  position: relative;
  display: grid;
  align-content: space-between;
  min-height: 52px;
  padding: 6px 4px;
  border: 1px solid rgba(186, 179, 230, 0.46);
  border-radius: 8px;
  background: var(--cf-surface-soft);
  color: var(--cf-heading);
}

.calendar-day-muted {
  opacity: 0.45;
}

.calendar-day-selected {
  border-color: var(--cf-rose-strong);
  background: var(--cf-rose-soft);
}

.calendar-day-today {
  border-color: var(--cf-mint);
  box-shadow: inset 0 0 0 1px var(--cf-mint);
}

.calendar-day-period {
  border-color: #df9b8f;
  background: #f3cfc8;
}

.calendar-day-predicted {
  border-color: var(--cf-amber);
  border-style: dashed;
  background: #fff2d8;
}

.calendar-day-predicted::after {
  content: none;
}

.calendar-day-follicular::after,
.calendar-day-ovulation::after,
.calendar-day-luteal::after {
  content: "";
  position: absolute;
  right: 7px;
  bottom: 5px;
  left: 7px;
  height: 3px;
  border-radius: 999px;
}

.calendar-day-follicular::after {
  background: #e8ce4f;
}

.calendar-day-ovulation::after {
  background: #e7a04b;
}

.calendar-day-luteal::after {
  background: #9da6e6;
}

.calendar-number {
  font-size: 0.88rem;
  font-weight: 800;
}

.calendar-markers {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-height: 16px;
  padding-bottom: 5px;
}

.period-marker {
  padding: 1px 3px;
  border-radius: 999px;
  background: var(--cf-rose-strong);
  color: white;
  font-size: 0.58rem;
  font-weight: 800;
}

.mood-marker {
  font-size: 0.74rem;
  line-height: 1;
}

.log-dot,
.period-plan-dot,
.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--cf-blue);
}

.period-plan-dot {
  background: var(--cf-amber);
}

.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  color: var(--cf-text);
  font-size: 0.76rem;
  font-weight: 800;
}

.calendar-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.calendar-legend i {
  display: inline-block;
  width: 14px;
  height: 3px;
  border-radius: 999px;
}

.legend-period {
  height: 10px !important;
  background: #f3cfc8;
}

.legend-follicular {
  background: #e8ce4f;
}

.legend-ovulation {
  background: #e7a04b;
}

.legend-luteal {
  background: #9da6e6;
}

.legend-predicted {
  width: 14px !important;
  height: 10px !important;
  border: 1px dashed var(--cf-amber);
  background: #fff2d8;
}

.trend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.trend-card {
  min-height: 174px;
  padding: 12px 10px;
  border: 1px solid var(--cf-border-warm);
  border-radius: 8px;
  background: var(--cf-surface-soft);
}

.trend-card h3 {
  margin-bottom: 12px;
  color: var(--cf-heading);
  font-size: 0.88rem;
  white-space: nowrap;
}

.trend-empty,
.trend-groups p {
  color: var(--cf-text);
  font-size: 0.8rem;
  line-height: 1.45;
}

.trend-groups {
  display: grid;
  gap: 9px;
}

.trend-groups span {
  color: var(--cf-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.cycle-bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 8;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--cf-border-warm);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 -10px 26px rgba(72, 55, 45, 0.08);
}

.cycle-bottom-nav button {
  min-height: 48px;
  border-radius: 12px;
  color: var(--cf-muted);
  font-size: 0.76rem;
  font-weight: 800;
}

.cycle-bottom-nav button.active {
  border: 1px solid #f0d9d0;
  background: var(--cf-rose-soft);
  color: var(--cf-rose-strong);
}

.cycle-modal {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px 12px calc(20px + env(safe-area-inset-bottom));
  background: rgba(46, 37, 35, 0.42);
}

.cycle-modal-panel {
  position: relative;
  display: grid;
  gap: 12px;
  width: min(100%, 640px);
  max-height: min(86svh, 760px);
  padding: 48px 14px 14px;
  overflow-y: auto;
  border-radius: 16px 16px 10px 10px;
  background: var(--cf-surface);
  box-shadow: 0 -18px 46px rgba(46, 37, 35, 0.2);
}

.cycle-modal-panel h2 {
  position: absolute;
  top: 18px;
  left: 18px;
  max-width: calc(100% - 78px);
  font-size: 1rem;
  letter-spacing: 0;
}

.cycle-modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--cf-border-warm);
  background: var(--cf-surface-soft);
  color: var(--cf-heading);
  font-size: 1.3rem;
  font-weight: 800;
}

.log-group {
  display: grid;
  gap: 10px;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.log-group legend,
.log-note span {
  color: var(--cf-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.chip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.chip-grid-two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.log-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
}

.log-chip-active {
  border-color: #d3917e;
  background: var(--cf-rose-soft);
  color: var(--cf-heading);
}

.mood-chip span {
  font-size: 1rem;
}

.log-note {
  display: grid;
  gap: 7px;
}

.log-note textarea {
  width: 100%;
  min-height: 78px;
  padding: 10px 12px;
  resize: vertical;
  border: 1px solid var(--cf-border-warm);
  border-radius: 8px;
  background: var(--cf-surface-soft);
  color: var(--cf-heading);
  font: inherit;
}

.info-panel {
  color: var(--cf-text);
  line-height: 1.7;
}

.settings-header {
  display: grid;
  gap: 6px;
}

.settings-header p,
.settings-guide p {
  color: var(--cf-text);
  font-size: 0.9rem;
}

.settings-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--cf-border-warm);
  border-radius: 8px;
  background: var(--cf-surface-soft);
}

.settings-summary span,
.settings-guide span {
  color: var(--cf-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.settings-summary strong {
  color: var(--cf-heading);
  font-size: 1.08rem;
}

.settings-guide {
  display: grid;
  gap: 8px;
}

.settings-guide h3 {
  color: var(--cf-heading);
  font-size: 1rem;
}

@media (min-width: 720px) {
  .cycle-food-shell {
    padding-top: 32px;
  }

  .meal-list,
  .condition-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .purchase-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cycle-modal {
    align-items: center;
  }

  .cycle-modal-panel {
    border-radius: 18px;
  }
}
</style>
