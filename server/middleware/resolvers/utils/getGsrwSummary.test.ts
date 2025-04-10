/* eslint-disable @typescript-eslint/no-explicit-any */
import getGsrwSummary from './getGsrwSummary'

describe('getGsrwSummary', () => {
  const username = 'mock_username'
  const params = {
    prisonId: 'mock_prison_id',
    dateFrom: '2025-01-01',
    dateTo: '2025-01-14',
  }

  const mockData = {
    numberOfPrisoners: 50,
    numberOfSupportDeclined: 10,
    numberOfNoRightToWork: 5,
  }

  const serviceMock = {
    getSummary: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getSummary.mockRejectedValue(error)

    try {
      await getGsrwSummary(serviceMock as any, username, params)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default summary', async () => {
    serviceMock.getSummary.mockRejectedValue({
      status: 404,
    })

    const result = await getGsrwSummary(serviceMock as any, username, params)

    expect(result).toEqual({
      numberOfPrisonersOver12Weeks: 0,
      numberOfPrisonersWithin12Weeks: 0,
      numberOfSupportDeclined: 0,
      numberOfNoRightToWork: 0,
    })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getSummary.mockResolvedValue(mockData)

    const result = await getGsrwSummary(serviceMock as any, username, params)

    expect(result).toEqual(mockData)
  })
})
