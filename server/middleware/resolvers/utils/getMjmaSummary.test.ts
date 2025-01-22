/* eslint-disable @typescript-eslint/no-explicit-any */
import getMjmaSummary from './getMjmaSummary'

describe('getMjmaSummary', () => {
  const jobServiceMock = {
    getSummary: jest.fn(),
  }

  const username = 'mock_username'
  const params = {
    prisonId: 'MDI',
    dateFrom: '2024-01-01',
    dateTo: '2024-01-31',
  }

  const mockSummary = {
    numberOfApplicants: 50,
    numberOfJobs: 10,
  }

  const error404 = { status: 404 }
  const genericError = new Error('mock_error')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('Returns summary data on success', async () => {
    jobServiceMock.getSummary.mockResolvedValue(mockSummary)

    const result = await getMjmaSummary(jobServiceMock as any, username, params)

    expect(jobServiceMock.getSummary).toHaveBeenCalledWith(username, params)
    expect(result).toEqual(mockSummary)
  })

  it('Returns default summary data on 404 error', async () => {
    jobServiceMock.getSummary.mockRejectedValue(error404)

    const result = await getMjmaSummary(jobServiceMock as any, username, params)

    expect(jobServiceMock.getSummary).toHaveBeenCalledWith(username, params)
    expect(result).toEqual({
      numberOfApplicants: 0,
      numberOfJobs: 0,
    })
  })

  it('Throws error for other exceptions', async () => {
    jobServiceMock.getSummary.mockRejectedValue(genericError)

    await expect(getMjmaSummary(jobServiceMock as any, username, params)).rejects.toThrow(genericError)

    expect(jobServiceMock.getSummary).toHaveBeenCalledWith(username, params)
  })
})
