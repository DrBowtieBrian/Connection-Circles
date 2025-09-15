export function nextThursday1215PT(): string {
  // Uses local timezone. For production, adjust to America/Los_Angeles.
  const now = new Date()
  const day = now.getDay() // 0 Sun .. 6 Sat
  const daysUntilThu = (4 - day + 7) % 7 || 7 // at least next Thursday
  const d = new Date(now)
  d.setDate(now.getDate() + daysUntilThu)
  d.setHours(12, 15, 0, 0)
  return d.toLocaleString()
}

export function copy(text: string) {
  // @ts-ignore
  navigator.clipboard?.writeText(text)
}
