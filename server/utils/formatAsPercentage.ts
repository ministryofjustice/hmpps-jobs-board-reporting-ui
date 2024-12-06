const isNumber = (n: unknown): n is number => typeof n === 'number' && !Number.isNaN(n)

/** Formats a ratio as a percentage string */
export default function formatAsPercentage(value: number, total: number, roundToInteger = true): string {
  if (value === 0 && total === 0) return '0%'
  if (!isNumber(total) || !isNumber(value) || total === 0) return '?'
  let percentage = (value / total) * 100
  if (roundToInteger) {
    percentage = Math.round(percentage)
  } else {
    percentage = Math.round(percentage * 1000) / 1000
  }
  return `${percentage}%`
}
