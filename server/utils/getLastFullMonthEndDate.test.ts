import getLastFullMonthEndDate from './getLastFullMonthEndDate'

describe('getLastFullMonthEndDate', () => {
  test('should return February 29 for March 15, 2024 (leap year)', () => {
    const referenceDate = new Date(2024, 2, 15) // March 15, 2024
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2024, 1, 29)) // February 29, 2024
  })

  test('should return February 28 for March 15, 2023 (non-leap year)', () => {
    const referenceDate = new Date(2023, 2, 15) // March 15, 2023
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2023, 1, 28)) // February 28, 2023
  })

  test('should handle December to November transition correctly', () => {
    const referenceDate = new Date(2024, 11, 25) // December 25, 2024
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2024, 10, 30)) // November 30, 2024
  })

  test('should handle January to December transition across years', () => {
    const referenceDate = new Date(2024, 0, 10) // January 10, 2024
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2023, 11, 31)) // December 31, 2023
  })

  test('should return the last day of the previous month for a date on the first of a month', () => {
    const referenceDate = new Date(2024, 2, 1) // March 1, 2024
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2024, 1, 29)) // February 29, 2024 (leap year)
  })

  test('should handle months with 30 days', () => {
    const referenceDate = new Date(2024, 7, 15) // August 15, 2024
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2024, 6, 31)) // July 31, 2024
  })

  test('should handle months with 31 days', () => {
    const referenceDate = new Date(2024, 4, 15) // May 15, 2024
    const result = getLastFullMonthEndDate(referenceDate)
    expect(result).toEqual(new Date(2024, 3, 30)) // April 30, 2024
  })
})
