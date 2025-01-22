/* eslint-disable @typescript-eslint/no-explicit-any */
import getTotalApplicationsByStage from './getTotalApplicationsByStage'

describe('getTotalApplicationsByStage', () => {
  const username = 'mock_username'
  const params = {
    prisonId: 'mock_prison_id',
    dateFrom: '2025-01-01',
    dateTo: '2025-01-14',
  }

  const mockData = [
    {
      applicationStatus: 'INTERVIEW_BOOKED',
      numberOfApplications: 5,
    },
    {
      applicationStatus: 'APPLICATION_MADE',
      numberOfApplications: 10,
    },
    {
      applicationStatus: 'APPLICATION_UNSUCCESSFUL',
      numberOfApplications: 2,
    },
  ]

  const jobServiceMock = {
    getTotalApplicationsByStage: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    jobServiceMock.getTotalApplicationsByStage.mockRejectedValue(error)

    try {
      await getTotalApplicationsByStage(jobServiceMock as any, username, params)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default application stages', async () => {
    jobServiceMock.getTotalApplicationsByStage.mockRejectedValue({
      status: 404,
    })

    const result = await getTotalApplicationsByStage(jobServiceMock as any, username, params)

    expect(result).toEqual([
      { applicationStatus: 'INTERVIEW_BOOKED', numberOfApplications: 0 },
      { applicationStatus: 'APPLICATION_MADE', numberOfApplications: 0 },
      { applicationStatus: 'APPLICATION_UNSUCCESSFUL', numberOfApplications: 0 },
      { applicationStatus: 'SELECTED_FOR_INTERVIEW', numberOfApplications: 0 },
      { applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW', numberOfApplications: 0 },
      { applicationStatus: 'JOB_OFFER', numberOfApplications: 0 },
    ])
  })

  it('On success - Returns correct data', async () => {
    jobServiceMock.getTotalApplicationsByStage.mockResolvedValue(mockData)

    const result = await getTotalApplicationsByStage(jobServiceMock as any, username, params)

    expect(result).toEqual(mockData)
  })
})
