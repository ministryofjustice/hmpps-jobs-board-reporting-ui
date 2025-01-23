/* eslint-disable @typescript-eslint/no-explicit-any */
import getLatestApplicationsByStage from './getLatestApplicationsByStage'

describe('getLatestApplicationsByStage', () => {
  const jobServiceMock = {
    getLatestApplicationsByStage: jest.fn(),
  }

  const username = 'mock_username'
  const params = {
    prisonId: 'MDI',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
  }

  const mockApplications = [
    { applicationStatus: 'APPLICATION_MADE', numberOfApplications: 10 },
    { applicationStatus: 'SELECTED_FOR_INTERVIEW', numberOfApplications: 5 },
  ]

  const error404 = { status: 404 }
  const genericError = new Error('mock_error')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Returns applications data on success', async () => {
    jobServiceMock.getLatestApplicationsByStage.mockResolvedValue(mockApplications)

    const result = await getLatestApplicationsByStage(jobServiceMock as any, username, params)

    expect(jobServiceMock.getLatestApplicationsByStage).toHaveBeenCalledWith(username, params)
    expect(result).toEqual(mockApplications)
  })

  it('Returns default applications data on 404 error', async () => {
    jobServiceMock.getLatestApplicationsByStage.mockRejectedValue(error404)

    const result = await getLatestApplicationsByStage(jobServiceMock as any, username, params)

    expect(jobServiceMock.getLatestApplicationsByStage).toHaveBeenCalledWith(username, params)
    expect(result).toEqual([
      { applicationStatus: 'APPLICATION_MADE', numberOfApplications: 0 },
      { applicationStatus: 'APPLICATION_UNSUCCESSFUL', numberOfApplications: 0 },
      { applicationStatus: 'SELECTED_FOR_INTERVIEW', numberOfApplications: 0 },
      { applicationStatus: 'INTERVIEW_BOOKED', numberOfApplications: 0 },
      { applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW', numberOfApplications: 0 },
      { applicationStatus: 'JOB_OFFER', numberOfApplications: 0 },
    ])
  })

  it('Throws error for other exceptions', async () => {
    jobServiceMock.getLatestApplicationsByStage.mockRejectedValue(genericError)

    await expect(getLatestApplicationsByStage(jobServiceMock as any, username, params)).rejects.toThrow(genericError)

    expect(jobServiceMock.getLatestApplicationsByStage).toHaveBeenCalledWith(username, params)
  })
})
