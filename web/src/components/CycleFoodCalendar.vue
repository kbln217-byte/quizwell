<script setup lang="ts">
import { computed } from 'vue'
import { moodIcons, phaseAdvice } from '../composables/useCycleFood'
import type { CyclePhase, DailyLogRecord } from '../types/cycleFood'

const props = defineProps<{
  selectedDate: string
  todayKey: string
  records: DailyLogRecord
  periodDateKeys: Set<string>
  predictedPeriodDateKeys: Set<string>
  getCalendarDates: (date: Date) => Date[]
  formatDateKey: (date: Date) => string
  getDatePhase: (date: Date) => CyclePhase
}>()

const emit = defineEmits<{
  select: [date: string]
  changeMonth: [date: string]
}>()

const weekDays = ['日', '月', '火', '水', '木', '金', '土']

const selectedDateValue = computed(() => {
  const [year, month, day] = props.selectedDate.split('-').map(Number)
  return new Date(year, month - 1, day)
})
const displayDates = computed(() => props.getCalendarDates(selectedDateValue.value))
const currentMonth = computed(() => selectedDateValue.value.getMonth())
const monthLabel = computed(() => `${selectedDateValue.value.getFullYear()}年${selectedDateValue.value.getMonth() + 1}月`)

function moveMonth(amount: number) {
  const next = new Date(selectedDateValue.value)
  next.setMonth(next.getMonth() + amount)
  emit('changeMonth', props.formatDateKey(next))
}

function hasLog(dateKey: string) {
  const log = props.records[dateKey]
  return Boolean(
    log &&
      (log.body.length ||
        log.skin.length ||
        log.mood.length ||
        log.note.trim() ||
        log.period.hasPeriod ||
        log.period.isStart ||
        log.period.isEnd),
  )
}

function isPredictedPeriod(dateKey: string) {
  return !props.periodDateKeys.has(dateKey) && props.predictedPeriodDateKeys.has(dateKey)
}
</script>

<template>
  <section class="cycle-calendar-card" aria-label="周期カレンダー">
    <div class="calendar-header">
      <button type="button" @click="moveMonth(-1)">前月</button>
      <h2>{{ monthLabel }}</h2>
      <button type="button" @click="moveMonth(1)">翌月</button>
    </div>

    <div class="calendar-weekdays" aria-hidden="true">
      <span v-for="day in weekDays" :key="day">{{ day }}</span>
    </div>

    <div class="calendar-grid">
      <button
        v-for="date in displayDates"
        :key="formatDateKey(date)"
        class="calendar-day"
        :class="[
          date.getMonth() !== currentMonth ? 'calendar-day-muted' : '',
          formatDateKey(date) === selectedDate ? 'calendar-day-selected' : '',
          formatDateKey(date) === todayKey ? 'calendar-day-today' : '',
          periodDateKeys.has(formatDateKey(date)) ? 'calendar-day-period' : `calendar-day-${getDatePhase(date).toLowerCase()}`,
          isPredictedPeriod(formatDateKey(date)) ? 'calendar-day-predicted' : '',
        ]"
        type="button"
        @click="emit('select', formatDateKey(date))"
      >
        <span class="calendar-number">{{ date.getDate() }}</span>
        <span class="calendar-markers" aria-hidden="true">
          <span v-if="records[formatDateKey(date)]?.period.isStart" class="period-marker">始</span>
          <span v-if="records[formatDateKey(date)]?.period.isEnd" class="period-marker">終</span>
          <span v-if="records[formatDateKey(date)]?.mood[0]" class="mood-marker">
            {{ moodIcons[records[formatDateKey(date)].mood[0]] }}
          </span>
          <span v-if="isPredictedPeriod(formatDateKey(date))" class="period-plan-dot" />
          <span v-if="hasLog(formatDateKey(date))" class="log-dot" />
        </span>
      </button>
    </div>

    <div class="calendar-legend">
      <span><i class="legend-period" />{{ phaseAdvice.MENSTRUATION.shortLabel }}</span>
      <span><i class="legend-follicular" />{{ phaseAdvice.FOLLICULAR.shortLabel }}</span>
      <span><i class="legend-ovulation" />{{ phaseAdvice.OVULATION.shortLabel }}</span>
      <span><i class="legend-luteal" />{{ phaseAdvice.LUTEAL.shortLabel }}</span>
      <span><i class="legend-predicted" />生理予定</span>
      <span><i class="legend-dot" />記録あり</span>
    </div>
  </section>
</template>
