import getBarChartRangeMax from './getBarChartRangeMax'

describe('getBarChartRangeMax', () => {
  test('returns the correct range when max value fits within a range step', () => {
    const data = [{ numberOfApplications: 26 }, { numberOfApplications: 16 }, { numberOfApplications: 10 }]
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(50)
  })

  test('returns the next range step when max value is slightly below it', () => {
    const data = [{ numberOfApplications: 99 }, { numberOfApplications: 10 }]
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(100)
  })

  test('returns the largest range step when max value exceeds all ranges', () => {
    const data = [{ numberOfApplications: 1500 }, { numberOfApplications: 1200 }]
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(1000)
  })

  test('handles an empty data array by returning the smallest range', () => {
    const data: { numberOfApplications: number }[] = []
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(10)
  })

  test('handles cases where the property does not exist or is undefined', () => {
    const data = [{ someOtherProperty: 20 }, { someOtherProperty: 50 }]
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(10)
  })

  test('handles custom range steps correctly', () => {
    const data = [{ value: 300 }, { value: 50 }]
    const customSteps = [100, 200, 400, 800]
    expect(getBarChartRangeMax(data, 'value', customSteps)).toBe(400)
  })

  test('handles cases where max value matches exactly with a range step', () => {
    const data = [{ numberOfApplications: 50 }, { numberOfApplications: 50 }]
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(50)
  })

  test('handles cases where all values are zero', () => {
    const data = [{ numberOfApplications: 0 }, { numberOfApplications: 0 }]
    expect(getBarChartRangeMax(data, 'numberOfApplications')).toBe(10)
  })
})
