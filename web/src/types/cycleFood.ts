export type CyclePhase = 'MENSTRUATION' | 'FOLLICULAR' | 'OVULATION' | 'LUTEAL'

export type BodyConditionKey =
  | 'none'
  | 'irregularBleeding'
  | 'fatigue'
  | 'headache'
  | 'swelling'
  | 'periodPain'
  | 'stomachPain'
  | 'sleepiness'

export type SkinConditionKey =
  | 'good'
  | 'dryness'
  | 'oily'
  | 'acne'
  | 'cloggedPores'

export type MoodConditionKey =
  | 'stable'
  | 'happy'
  | 'relaxed'
  | 'sensitive'
  | 'anxious'
  | 'irritability'
  | 'lowMood'

export type DailyLog = {
  date: string
  period: {
    hasPeriod: boolean
    isStart: boolean
    isEnd: boolean
  }
  body: BodyConditionKey[]
  skin: SkinConditionKey[]
  mood: MoodConditionKey[]
  note: string
  updatedAt: string
}

export type DailyLogRecord = Record<string, DailyLog>

export type PredictionCondition = {
  key: 'skin' | 'mood' | 'body'
  label: string
  value: string
  detail: string
}

export type PeriodHistory = {
  id: string
  startDate: string
  endDate: string
}

export type PhaseAdvice = {
  label: string
  shortLabel: string
  summary: string
  mealPlan: {
    breakfast: string
    lunch: string
    dinner: string
  }
  nutrients: string[]
  mealReason: string
  purchaseItems: Array<{
    name: string
    note: string
  }>
}
