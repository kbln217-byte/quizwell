<script setup lang="ts">
import { computed } from 'vue'
import {
  bodyOptions,
  moodOptions,
  skinOptions,
} from '../composables/useCycleFood'
import type {
  BodyConditionKey,
  DailyLog,
  MoodConditionKey,
  SkinConditionKey,
} from '../types/cycleFood'

const props = defineProps<{
  log: DailyLog
}>()

const emit = defineEmits<{
  close: []
  save: [log: DailyLog]
}>()

const dateLabel = computed(() => {
  const [, month, day] = props.log.date.split('-').map(Number)
  return `${month}月${day}日の記録`
})

function toggleArray<Key extends string>(values: Key[], key: Key, exclusiveKey?: Key) {
  if (values.includes(key)) {
    return values.filter((value) => value !== key)
  }
  if (key === exclusiveKey) {
    return [key]
  }
  return [...values.filter((value) => value !== exclusiveKey), key]
}

function updatePeriod(field: 'isStart' | 'isEnd') {
  const period = {
    ...props.log.period,
    [field]: !props.log.period[field],
  }
  emit('save', {
    ...props.log,
    period: {
      ...period,
      hasPeriod: period.isStart || period.isEnd || period.hasPeriod,
    },
  })
}

function updateBody(key: BodyConditionKey) {
  emit('save', {
    ...props.log,
    body: toggleArray(props.log.body, key, 'none'),
  })
}

function updateSkin(key: SkinConditionKey) {
  emit('save', {
    ...props.log,
    skin: toggleArray(props.log.skin, key, 'good'),
  })
}

function updateMood(key: MoodConditionKey) {
  emit('save', {
    ...props.log,
    mood: toggleArray(props.log.mood, key, 'stable'),
  })
}

function updateNote(note: string) {
  emit('save', {
    ...props.log,
    note,
  })
}
</script>

<template>
  <div class="cycle-modal" role="presentation" @mousedown.self="emit('close')">
    <section class="cycle-modal-panel" role="dialog" aria-modal="true" :aria-label="dateLabel">
      <button class="cycle-modal-close" type="button" aria-label="閉じる" @click="emit('close')">×</button>
      <h2>{{ dateLabel }}</h2>

      <fieldset class="log-group">
        <legend>生理</legend>
        <div class="chip-grid chip-grid-two">
          <button
            class="log-chip"
            :class="{ 'log-chip-active': log.period.isStart }"
            type="button"
            @click="updatePeriod('isStart')"
          >
            生理開始日
          </button>
          <button
            class="log-chip"
            :class="{ 'log-chip-active': log.period.isEnd }"
            type="button"
            @click="updatePeriod('isEnd')"
          >
            生理終了日
          </button>
        </div>
      </fieldset>

      <fieldset class="log-group">
        <legend>体調</legend>
        <div class="chip-grid">
          <button
            v-for="option in bodyOptions"
            :key="option.key"
            class="log-chip"
            :class="{ 'log-chip-active': log.body.includes(option.key) }"
            type="button"
            @click="updateBody(option.key)"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>

      <fieldset class="log-group">
        <legend>肌</legend>
        <div class="chip-grid">
          <button
            v-for="option in skinOptions"
            :key="option.key"
            class="log-chip"
            :class="{ 'log-chip-active': log.skin.includes(option.key) }"
            type="button"
            @click="updateSkin(option.key)"
          >
            {{ option.label }}
          </button>
        </div>
      </fieldset>

      <fieldset class="log-group">
        <legend>気分</legend>
        <div class="chip-grid chip-grid-two">
          <button
            v-for="option in moodOptions"
            :key="option.key"
            class="log-chip mood-chip"
            :class="{ 'log-chip-active': log.mood.includes(option.key) }"
            type="button"
            @click="updateMood(option.key)"
          >
            <span>{{ option.icon }}</span>
            {{ option.label }}
          </button>
        </div>
      </fieldset>

      <label class="log-note">
        <span>コメント</span>
        <textarea
          :value="log.note"
          placeholder="メモを残す"
          rows="3"
          @input="updateNote(($event.target as HTMLTextAreaElement).value)"
        />
      </label>
    </section>
  </div>
</template>
