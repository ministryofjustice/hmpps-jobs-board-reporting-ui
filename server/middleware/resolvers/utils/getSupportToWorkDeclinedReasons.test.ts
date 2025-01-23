/* eslint-disable @typescript-eslint/no-explicit-any */
import getSupportToWorkDeclinedReasons from './getSupportToWorkDeclinedReasons'

describe('getSupportToWorkDeclinedReasons', () => {
  const username = 'mock_username'
  const params = {
    prisonId: 'mock_prison_id',
    dateFrom: '2025-01-01',
    dateTo: '2025-01-14',
  }

  const mockData = [
    {
      supportToWorkDeclinedReason: 'ALREADY_HAS_WORK',
      numberOfPrisoners: 5,
    },
    {
      supportToWorkDeclinedReason: 'HEALTH',
      numberOfPrisoners: 3,
    },
    {
      supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE',
      numberOfPrisoners: 2,
    },
  ]

  const serviceMock = {
    getSupportToWorkDeclinedReasons: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getSupportToWorkDeclinedReasons.mockRejectedValue(error)

    try {
      await getSupportToWorkDeclinedReasons(serviceMock as any, username, params)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default declined reasons', async () => {
    serviceMock.getSupportToWorkDeclinedReasons.mockRejectedValue({
      status: 404,
    })

    const result = await getSupportToWorkDeclinedReasons(serviceMock as any, username, params)

    expect(result).toEqual([
      { supportToWorkDeclinedReason: 'ALREADY_HAS_WORK', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'LIMIT_THEIR_ABILITY', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'FULL_TIME_CARER', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'LACKS_CONFIDENCE_OR_MOTIVATION', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'HEALTH', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'NO_REASON', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'RETIRED', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'RETURNING_TO_JOB', numberOfPrisoners: 0 },
      { supportToWorkDeclinedReason: 'SELF_EMPLOYED', numberOfPrisoners: 0 },
    ])
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getSupportToWorkDeclinedReasons.mockResolvedValue(mockData)

    const result = await getSupportToWorkDeclinedReasons(serviceMock as any, username, params)

    expect(result).toEqual(mockData)
  })
})
