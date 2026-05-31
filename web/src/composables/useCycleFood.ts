import { computed, ref, watch } from 'vue'
import type {
  BodyConditionKey,
  CyclePhase,
  DailyLog,
  DailyLogRecord,
  MoodConditionKey,
  PeriodHistory,
  PhaseAdvice,
  PredictionCondition,
  SkinConditionKey,
} from '../types/cycleFood'

const STORAGE_KEY = 'quizwell:cycle-food'
const MS_PER_DAY = 24 * 60 * 60 * 1000

export const bodyOptions: Array<{ key: BodyConditionKey; label: string }> = [
  { key: 'none', label: '症状なし' },
  { key: 'irregularBleeding', label: '不正出血' },
  { key: 'fatigue', label: 'だるさ' },
  { key: 'headache', label: '頭痛' },
  { key: 'swelling', label: 'むくみ' },
  { key: 'periodPain', label: '生理痛' },
  { key: 'stomachPain', label: '腹痛' },
  { key: 'sleepiness', label: '眠気' },
]

export const skinOptions: Array<{ key: SkinConditionKey; label: string }> = [
  { key: 'good', label: '良好' },
  { key: 'dryness', label: '乾燥' },
  { key: 'oily', label: '脂っぽい' },
  { key: 'acne', label: 'ニキビ' },
  { key: 'cloggedPores', label: '毛穴詰まり' },
]

export const moodOptions: Array<{ key: MoodConditionKey; label: string; icon: string }> = [
  { key: 'stable', label: '安定', icon: '😊' },
  { key: 'happy', label: '幸福', icon: '😊' },
  { key: 'relaxed', label: 'リラックス', icon: '😌' },
  { key: 'lowMood', label: '落ち込み', icon: '😢' },
  { key: 'anxious', label: '不安', icon: '😟' },
  { key: 'irritability', label: 'イライラ', icon: '😠' },
  { key: 'sensitive', label: '敏感', icon: '🫧' },
]

export const bodyLabels = Object.fromEntries(
  bodyOptions.map((option) => [option.key, option.label]),
) as Record<BodyConditionKey, string>

export const skinLabels = Object.fromEntries(
  skinOptions.map((option) => [option.key, option.label]),
) as Record<SkinConditionKey, string>

export const moodLabels = Object.fromEntries(
  moodOptions.map((option) => [option.key, option.label]),
) as Record<MoodConditionKey, string>

export const moodIcons = Object.fromEntries(
  moodOptions.map((option) => [option.key, option.icon]),
) as Record<MoodConditionKey, string>

export const phaseOrder: CyclePhase[] = [
  'MENSTRUATION',
  'FOLLICULAR',
  'OVULATION',
  'LUTEAL',
]

export const phaseAdvice: Record<CyclePhase, PhaseAdvice> = {
  MENSTRUATION: {
    label: '無理せず整えたい時期',
    shortLabel: '整え期',
    summary: '体を温めながら、無理をしすぎず過ごしたい時期です。',
    mealPlan: {
      breakfast: '鮭おにぎり、味噌汁',
      lunch: '鶏そぼろ丼、ほうれん草のおひたし',
      dinner: '豆腐入り雑炊、温野菜',
    },
    nutrients: ['鉄分', 'たんぱく質', 'ビタミンB群'],
    mealReason: '鉄分とたんぱく質を補いやすい組み合わせです。',
    purchaseItems: [
      { name: '鉄分ドリンク', note: '鉄分を意識したい時期に足しやすいです。' },
      { name: '雑炊・おかゆ', note: '食欲がない日でも温かく食べやすいです。' },
      { name: '豆腐', note: 'たんぱく質をやさしく足せます。' },
      { name: '温かいスープ', note: '体を冷やしたくない日に選びやすいです。' },
    ],
  },
  FOLLICULAR: {
    label: '元気が出やすい時期',
    shortLabel: '元気期',
    summary: '軽やかに動きやすく、整った食事でリズムを作りたい時期です。',
    mealPlan: {
      breakfast: 'ほうれん草オムレツ、ヨーグルト',
      lunch: '鶏むね肉とブロッコリーのサラダボウル',
      dinner: '納豆と温玉のごはん、野菜スープ',
    },
    nutrients: ['葉酸', 'ビタミンB群', 'たんぱく質'],
    mealReason: '葉酸とたんぱく質を取り入れやすい組み合わせです。',
    purchaseItems: [
      { name: 'ヨーグルト', note: '朝食や間食に手軽に足しやすいです。' },
      { name: '無塩ナッツ', note: '小腹が空いた時に選びやすいです。' },
      { name: '鶏むね肉', note: 'たんぱく質補給に使いやすいです。' },
      { name: '玄米パック', note: '忙しい日でも主食を整えやすいです。' },
    ],
  },
  OVULATION: {
    label: '妊娠しやすい時期',
    shortLabel: '妊娠しやすい時期',
    summary: '活動しやすい一方で、体の変化にも気づいておきたい時期です。',
    mealPlan: {
      breakfast: 'アボカドトースト、豆乳',
      lunch: 'サバと玄米の定食',
      dinner: '豚しゃぶサラダ、具だくさん味噌汁',
    },
    nutrients: ['葉酸', 'ビタミンE', '良質な脂質'],
    mealReason: '葉酸や良質な脂質を意識しやすい内容です。',
    purchaseItems: [
      { name: '葉酸サプリ', note: '葉酸を意識したい時期の補助に使いやすいです。' },
      { name: 'アーモンド', note: 'ビタミンEを間食で取り入れやすいです。' },
      { name: '温活飲料', note: '冷えが気になる日に温かく飲めます。' },
      { name: 'たんぱく質補助食品', note: '食事だけで足りない時に足しやすいです。' },
    ],
  },
  LUTEAL: {
    label: 'ゆらぎに備えたい時期',
    shortLabel: 'ゆらぎ期',
    summary: '眠気やむくみ、気分のゆらぎに備えて、穏やかに整えたい時期です。',
    mealPlan: {
      breakfast: 'バナナ、豆乳、全粒パン',
      lunch: '鮭ときのこの玄米弁当',
      dinner: '豚汁、豆腐、温野菜',
    },
    nutrients: ['マグネシウム', '食物繊維', 'ビタミンB6'],
    mealReason: 'むくみや甘いもの欲に備えやすい組み合わせです。',
    purchaseItems: [
      { name: 'バナナ', note: '朝食や間食に取り入れやすいです。' },
      { name: '豆乳', note: 'たんぱく質を少し足したい日に便利です。' },
      { name: 'ルイボスティー', note: 'カフェインを控えたい時間にも選びやすいです。' },
      { name: 'カカオ高めチョコ', note: '甘いものを選びたい時に少量で満足しやすいです。' },
    ],
  },
}

export const predictedConditions: Record<CyclePhase, PredictionCondition[]> = {
  MENSTRUATION: [
    {
      key: 'skin',
      label: '肌',
      value: '乾燥しやすい傾向',
      detail: '肌のゆらぎや血色の変化を感じやすい傾向があります。',
    },
    {
      key: 'mood',
      label: '気分',
      value: '落ち込みやすい傾向',
      detail: '眠気や気分の重さが出やすい傾向があります。',
    },
    {
      key: 'body',
      label: '体調',
      value: 'だるさを感じやすい傾向',
      detail: '下腹部の重さや冷えを感じやすい傾向があります。',
    },
  ],
  FOLLICULAR: [
    {
      key: 'skin',
      label: '肌',
      value: '安定しやすい傾向',
      detail: '肌の調子が整いやすく、メイクのりも安定しやすい傾向があります。',
    },
    {
      key: 'mood',
      label: '気分',
      value: '前向きになりやすい傾向',
      detail: '集中力や行動力が戻りやすい傾向があります。',
    },
    {
      key: 'body',
      label: '体調',
      value: '軽やかに動きやすい傾向',
      detail: '活動量を少し増やしても過ごしやすい傾向があります。',
    },
  ],
  OVULATION: [
    {
      key: 'skin',
      label: '肌',
      value: '皮脂が出やすい',
      detail: '皮脂や毛穴の変化を感じやすい傾向があります。',
    },
    {
      key: 'mood',
      label: '気分',
      value: '前向きになりやすい',
      detail: '外出や人と会う予定に気持ちが向きやすい傾向があります。',
    },
    {
      key: 'body',
      label: '体調',
      value: '軽やかで活動しやすい',
      detail: '動きやすさを感じやすい一方で、違和感が出る人もいます。',
    },
  ],
  LUTEAL: [
    {
      key: 'skin',
      label: '肌',
      value: '乾燥・むくみが出やすい',
      detail: '乾燥や肌のゆらぎを感じやすい傾向があります。',
    },
    {
      key: 'mood',
      label: '気分',
      value: '敏感・不安定になりやすい',
      detail: '気分の波やイライラを感じやすい傾向があります。',
    },
    {
      key: 'body',
      label: '体調',
      value: '眠気・だるさが出やすい',
      detail: '眠気、だるさ、食欲の変化が出やすい傾向があります。',
    },
  ],
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function toDayTime(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
}

function dayDiff(later: Date, earlier: Date) {
  return Math.round((toDayTime(later) - toDayTime(earlier)) / MS_PER_DAY)
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function createDailyLog(date: string): DailyLog {
  return {
    date,
    period: { hasPeriod: false, isStart: false, isEnd: false },
    body: [],
    skin: [],
    mood: [],
    note: '',
    updatedAt: new Date().toISOString(),
  }
}

function readStorage(): { dailyRecords: DailyLogRecord; cycleHistory: PeriodHistory[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        dailyRecords: {},
        cycleHistory: [
          { id: 'period-2026-04-20', startDate: '2026-04-20', endDate: '2026-04-24' },
          { id: 'period-2026-03-23', startDate: '2026-03-23', endDate: '2026-03-27' },
        ],
      }
    }
    return JSON.parse(raw) as { dailyRecords: DailyLogRecord; cycleHistory: PeriodHistory[] }
  } catch {
    return { dailyRecords: {}, cycleHistory: [] }
  }
}

function getHistoryFromLogs(records: DailyLogRecord): PeriodHistory[] {
  const logs = Object.values(records).sort((a, b) => a.date.localeCompare(b.date))
  const endDates = logs.filter((log) => log.period.isEnd).map((log) => log.date)

  return logs
    .filter((log) => log.period.isStart)
    .map((startLog) => ({
      id: `period-${startLog.date}`,
      startDate: startLog.date,
      endDate: endDates.find((date) => date >= startLog.date) ?? startLog.date,
    }))
}

function getAverageCycleLength(history: PeriodHistory[]) {
  if (history.length < 2) {
    return 28
  }
  const sorted = [...history].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const lengths = sorted.slice(1).map((entry, index) =>
    dayDiff(parseDateKey(entry.startDate), parseDateKey(sorted[index].startDate)),
  )
  return Math.max(21, Math.min(45, Math.round(lengths.reduce((sum, value) => sum + value, 0) / lengths.length)))
}

function getPeriodLength(history?: PeriodHistory) {
  if (!history) {
    return 5
  }
  return Math.max(1, dayDiff(parseDateKey(history.endDate), parseDateKey(history.startDate)) + 1)
}

function getCycleDay(startDate: Date, cycleLength: number, today: Date) {
  const elapsed = dayDiff(today, startDate)
  return ((elapsed % cycleLength) + cycleLength) % cycleLength + 1
}

function getCyclePhase(startDate: Date, cycleLength: number, periodLength: number, today: Date): CyclePhase {
  const cycleDay = getCycleDay(startDate, cycleLength, today)
  const ovulationDay = Math.max(periodLength + 1, cycleLength - 14)
  const ovulationStart = Math.max(periodLength + 1, ovulationDay - 2)
  const ovulationEnd = Math.min(cycleLength, ovulationDay + 2)

  if (cycleDay <= periodLength) {
    return 'MENSTRUATION'
  }
  if (cycleDay >= ovulationStart && cycleDay <= ovulationEnd) {
    return 'OVULATION'
  }
  if (cycleDay < ovulationStart) {
    return 'FOLLICULAR'
  }
  return 'LUTEAL'
}

function getPeriodKeys(records: DailyLogRecord) {
  const keys = new Set<string>()
  getHistoryFromLogs(records).forEach((history) => {
    const current = parseDateKey(history.startDate)
    const end = parseDateKey(history.endDate)
    while (current <= end) {
      keys.add(formatDateKey(current))
      current.setDate(current.getDate() + 1)
    }
  })
  Object.values(records).forEach((log) => {
    if (log.period.hasPeriod) {
      keys.add(log.date)
    }
  })
  return keys
}

function getCalendarDates(displayDate: Date) {
  const firstDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1)
  const startDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1 - firstDate.getDay())
  return Array.from({ length: 42 }, (_, index) => addDays(startDate, index))
}

function getPredictedPeriodKeys(
  periodStartDate: Date,
  cycleLength: number,
  periodLength: number,
  selectedDate: string,
) {
  const selectedDateValue = parseDateKey(selectedDate)
  const monthStart = new Date(selectedDateValue.getFullYear(), selectedDateValue.getMonth(), 1)
  const monthEnd = new Date(selectedDateValue.getFullYear(), selectedDateValue.getMonth() + 1, 0)
  const keys = new Set<string>()
  const predictedStart = new Date(periodStartDate)

  while (predictedStart < monthStart) {
    predictedStart.setDate(predictedStart.getDate() + cycleLength)
  }

  while (predictedStart <= monthEnd) {
    Array.from({ length: periodLength }, (_, index) => {
      const predictedDate = new Date(predictedStart)
      predictedDate.setDate(predictedStart.getDate() + index)

      if (predictedDate >= monthStart && predictedDate <= monthEnd) {
        keys.add(formatDateKey(predictedDate))
      }
    })

    predictedStart.setDate(predictedStart.getDate() + cycleLength)
  }

  return keys
}

function getTopLabels(values: string[]) {
  const counts = new Map<string, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label)
}

export function useCycleFood() {
  const saved = readStorage()
  const dailyRecords = ref<DailyLogRecord>(saved.dailyRecords)
  const cycleHistory = ref<PeriodHistory[]>(saved.cycleHistory)
  const selectedDate = ref(formatDateKey(new Date()))
  const activeView = ref<'home' | 'calendar' | 'trends' | 'settings'>('home')

  watch(
    [dailyRecords, cycleHistory],
    () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        dailyRecords: dailyRecords.value,
        cycleHistory: cycleHistory.value,
      }))
    },
    { deep: true },
  )

  const today = computed(() => new Date())
  const todayKey = computed(() => formatDateKey(today.value))
  const periodHistory = computed(() => {
    const fromLogs = getHistoryFromLogs(dailyRecords.value)
    return fromLogs.length > 0 ? fromLogs : cycleHistory.value
  })
  const sortedHistory = computed(() => [...periodHistory.value].sort((a, b) => b.startDate.localeCompare(a.startDate)))
  const latestHistory = computed(() => sortedHistory.value[0])
  const averageCycleLength = computed(() => getAverageCycleLength(periodHistory.value))
  const periodLength = computed(() => Math.min(getPeriodLength(latestHistory.value), averageCycleLength.value))
  const periodStartDate = computed(() => latestHistory.value ? parseDateKey(latestHistory.value.startDate) : today.value)
  const currentPhase = computed(() => getCyclePhase(
    periodStartDate.value,
    averageCycleLength.value,
    periodLength.value,
    today.value,
  ))
  const currentCycleDay = computed(() => getCycleDay(periodStartDate.value, averageCycleLength.value, today.value))
  const periodDue = computed(() => {
    const nextPeriod = addDays(periodStartDate.value, averageCycleLength.value)
    const diff = dayDiff(nextPeriod, today.value)
    if (diff > 0) {
      return { label: '生理予定', value: `あと${diff}日`, detail: `生理予定日まであと${diff}日` }
    }
    if (diff === 0) {
      return { label: '生理予定', value: '今日', detail: '本日が生理予定日です' }
    }
    return { label: '生理予定', value: `${Math.abs(diff)}日経過`, detail: `生理予定日から${Math.abs(diff)}日経過しています` }
  })
  const todayAdvice = computed(() => phaseAdvice[currentPhase.value])
  const todayConditions = computed(() => predictedConditions[currentPhase.value])
  const periodDateKeys = computed(() => getPeriodKeys(dailyRecords.value))
  const predictedPeriodDateKeys = computed(() =>
    getPredictedPeriodKeys(
      periodStartDate.value,
      averageCycleLength.value,
      periodLength.value,
      selectedDate.value,
    ),
  )

  function getLog(date: string) {
    return dailyRecords.value[date] ?? createDailyLog(date)
  }

  function saveLog(log: DailyLog) {
    dailyRecords.value = {
      ...dailyRecords.value,
      [log.date]: {
        ...log,
        period: {
          ...log.period,
          hasPeriod: log.period.isStart || log.period.isEnd || log.period.hasPeriod,
        },
        updatedAt: new Date().toISOString(),
      },
    }
  }

  function getDatePhase(date: Date) {
    return getCyclePhase(periodStartDate.value, averageCycleLength.value, periodLength.value, date)
  }

  const trends = computed(() => phaseOrder.map((phase) => {
    const logs = Object.values(dailyRecords.value).filter((log) => {
      const hasRecord = log.body.length || log.skin.length || log.mood.length || log.note.trim() || log.period.hasPeriod
      return hasRecord && getDatePhase(parseDateKey(log.date)) === phase
    })
    const body = getTopLabels(logs.flatMap((log) => log.body.map((key) => bodyLabels[key])))
    const skin = getTopLabels(logs.flatMap((log) => log.skin.map((key) => skinLabels[key])))
    const mood = getTopLabels(logs.flatMap((log) => log.mood.map((key) => moodLabels[key])))

    return {
      phase,
      label: phaseAdvice[phase].shortLabel,
      hasEnoughRecords: logs.length >= 2 && Boolean(body.length || skin.length || mood.length),
      body,
      skin,
      mood,
    }
  }))

  return {
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
  }
}
