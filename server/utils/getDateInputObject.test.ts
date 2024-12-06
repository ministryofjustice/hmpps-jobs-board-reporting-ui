import getDateInputObject from './getDateInputObject'

describe('getDateInputObject', () => {
  it('should return an object with empty strings if dateString is falsy', () => {
    const result = getDateInputObject('', 'testField')
    expect(result).toEqual({
      'testField-day': '',
      'testField-month': '',
      'testField-year': '',
    })
  })

  it('should return an object with day, month, and year extracted from a valid date string', () => {
    const result = getDateInputObject('2023-07-22T00:00:00.000Z', 'testField')
    expect(result).toEqual({
      'testField-day': '22',
      'testField-month': '7',
      'testField-year': '2023',
    })
  })

  it('should handle different date formats correctly', () => {
    const result1 = getDateInputObject('2023-07-22', 'testField')
    expect(result1).toEqual({
      'testField-day': '22',
      'testField-month': '7',
      'testField-year': '2023',
    })

    const result2 = getDateInputObject('07/22/2023', 'testField')
    expect(result2).toEqual({
      'testField-day': '22',
      'testField-month': '7',
      'testField-year': '2023',
    })
  })

  it('should handle invalid date strings by returning NaN values', () => {
    const result = getDateInputObject('invalid-date', 'testField')
    expect(result).toEqual({
      'testField-day': 'NaN',
      'testField-month': 'NaN',
      'testField-year': 'NaN',
    })
  })
})
