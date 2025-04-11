/* eslint-disable @typescript-eslint/no-explicit-any */
import getWorkStatusProgress from './getWorkStatusProgress'

describe('getWorkStatusProgress', () => {
  const username = 'mock_username'
  const params = {
    prisonId: 'mock_prison_id',
    dateFrom: '2025-01-01',
    dateTo: '2025-01-14',
  }

  const mockData = {
    numberOfPrisonersStatusChange: 10,
    statusCounts: [
      {
        profileStatus: 'NO_RIGHT_TO_WORK',
        numberOfPrisoners: 5,
      },
      {
        profileStatus: 'SUPPORT_DECLINED',
        numberOfPrisoners: 2,
      },
      {
        profileStatus: 'SUPPORT_NEEDED',
        numberOfPrisoners: 2,
      },
      {
        profileStatus: 'READY_TO_WORK',
        numberOfPrisoners: 1,
      },
    ],
  }

  const serviceMock = {
    getWorkStatusProgress: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getWorkStatusProgress.mockRejectedValue(error)

    try {
      await getWorkStatusProgress(serviceMock as any, username, params)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default empty data', async () => {
    serviceMock.getWorkStatusProgress.mockRejectedValue({
      status: 404,
    })

    const result = await getWorkStatusProgress(serviceMock as any, username, params)

    expect(result).toEqual({
      numberOfPrisonersStatusChange: 0,
      statusCounts: [
        {
          profileStatus: 'NO_RIGHT_TO_WORK',
          numberOfPrisonersOver12Weeks: 0,
          numberOfPrisonersWithin12Weeks: 0,
        },
        {
          profileStatus: 'SUPPORT_DECLINED',
          numberOfPrisonersOver12Weeks: 0,
          numberOfPrisonersWithin12Weeks: 0,
        },
        {
          profileStatus: 'SUPPORT_NEEDED',
          numberOfPrisonersOver12Weeks: 0,
          numberOfPrisonersWithin12Weeks: 0,
        },
        {
          profileStatus: 'READY_TO_WORK',
          numberOfPrisonersOver12Weeks: 0,
          numberOfPrisonersWithin12Weeks: 0,
        },
      ],
    })
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getWorkStatusProgress.mockResolvedValue(mockData)

    const result = await getWorkStatusProgress(serviceMock as any, username, params)

    expect(result).toEqual(mockData)
  })
})
