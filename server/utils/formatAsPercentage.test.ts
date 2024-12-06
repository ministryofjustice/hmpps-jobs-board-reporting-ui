import formatAsPercentage from './formatAsPercentage'

describe('formatAsPercentage', () => {
  test('formats percentage with default rounding', () => {
    expect(formatAsPercentage(50, 100)).toBe('50%')
  })

  test('formats percentage without rounding', () => {
    expect(formatAsPercentage(50, 200, false)).toBe('25%')
    expect(formatAsPercentage(1, 3, false)).toBe('33.333%')
  })

  test('handles zero values correctly', () => {
    expect(formatAsPercentage(0, 0)).toBe('0%')
    expect(formatAsPercentage(0, 100)).toBe('0%')
    expect(formatAsPercentage(50, 0)).toBe('?')
  })

  test('handles invalid inputs', () => {
    expect(formatAsPercentage(NaN, 100)).toBe('?')
    expect(formatAsPercentage(50, NaN)).toBe('?')
    expect(formatAsPercentage('string' as unknown as number, 100)).toBe('?')
    expect(formatAsPercentage(50, 'string' as unknown as number)).toBe('?')
    expect(formatAsPercentage(undefined as unknown as number, 100)).toBe('?')
    expect(formatAsPercentage(50, null as unknown as number)).toBe('?')
  })

  test('rounds correctly for small fractions', () => {
    expect(formatAsPercentage(1, 3)).toBe('33%')
    expect(formatAsPercentage(2, 3)).toBe('67%')
  })

  test('handles edge cases with large numbers', () => {
    expect(formatAsPercentage(1, 1000000)).toBe('0%')
    expect(formatAsPercentage(999999, 1000000)).toBe('100%')
    expect(formatAsPercentage(500000, 1000000)).toBe('50%')
  })
})
