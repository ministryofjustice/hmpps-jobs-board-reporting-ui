export default function getBarChartRangeMax(
  data: { [key: string]: number }[],
  property: string,
  rangeSteps = [10, 50, 100, 200, 500, 1000],
): number {
  const maxValue = Math.max(...data.map(item => item[property] || 0))

  // Find the smallest range step that is greater than or equal to maxValue
  const suitableRange = rangeSteps.find(range => maxValue <= range)

  // Return the suitable range, or the largest range step if no suitable one is found
  return suitableRange || rangeSteps[rangeSteps.length - 1]
}
