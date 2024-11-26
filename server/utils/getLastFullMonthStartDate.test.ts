import getLastFullMonthStartDate from './getLastFullMonthStartDate'

describe('getLastFullMonthStartDate', () => {
  test('should return February 1 for March 15, 2024 (normal case)', () => {
    const referenceDate = new Date(2024, 2, 15) // March 15, 2024
    const result = getLastFullMonthStartDate(referenceDate)
    expect(result).toEqual(new Date(2024, 1, 1)) // February 1, 2024
  })

  test('should handle year transition (e.g., January to December)', () => {
    const referenceDate = new Date(2024, 0, 10) // January 10, 2024
    const result = getLastFullMonthStartDate(referenceDate)
    expect(result).toEqual(new Date(2023, 11, 1)) // December 1, 2023
  })

  test('should handle February in leap years', () => {
    const referenceDate = new Date(2024, 3, 5) // April 5, 2024
    const result = getLastFullMonthStartDate(referenceDate)
    expect(result).toEqual(new Date(2024, 2, 1)) // March 1, 2024
  })

  test('should handle February in non-leap years', () => {
    const referenceDate = new Date(2023, 3, 5) // April 5, 2023
    const result = getLastFullMonthStartDate(referenceDate)
    expect(result).toEqual(new Date(2023, 2, 1)) // March 1, 2023
  })

  test('should handle December to November transition', () => {
    const referenceDate = new Date(2024, 11, 25) // December 25, 2024
    const result = getLastFullMonthStartDate(referenceDate)
    expect(result).toEqual(new Date(2024, 10, 1)) // November 1, 2024
  })

  test('should work for exact first day of a month', () => {
    const referenceDate = new Date(2024, 2, 1) // March 1, 2024
    const result = getLastFullMonthStartDate(referenceDate)
    expect(result).toEqual(new Date(2024, 1, 1)) // February 1, 2024
  })
})
