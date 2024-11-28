/* eslint-disable @typescript-eslint/no-explicit-any */
import expressMocks from '../../testutils/expressMocks'
import getMjmaDashboardResolver from './getMjmaDashboardResolver'

describe('getMjmaDashboardResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { caseLoadId: 'MDI' }
  req.query = { dateFrom: '01/03/2024', dateTo: '10/03/2024' }

  const mockSummary = {
    jobCount: 10,
    totalHoursWorked: 50,
    details: [{ jobId: 1, jobName: 'Cleaner', hoursWorked: 10 }],
  }

  const mockApplicationsByStage = [
    {
      applicationStatus: 'APPLICATION_MADE',
      numberOfApplications: 26,
    },
  ]

  const jobServiceMock = {
    getSummary: jest.fn(),
    getTotalApplicationsByStage: jest.fn(),
  }

  const error = new Error('mock_error')

  const resolver = getMjmaDashboardResolver(jobServiceMock as any)

  it('On error - Calls next with error', async () => {
    jobServiceMock.getSummary.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(jobServiceMock.getSummary).toHaveBeenCalledWith('mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-03-01',
      dateTo: '2024-03-10',
    })
    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Attaches data to context and calls next', async () => {
    jobServiceMock.getSummary.mockResolvedValue(mockSummary)
    jobServiceMock.getTotalApplicationsByStage.mockResolvedValue(mockApplicationsByStage)

    await resolver(req, res, next)

    expect(jobServiceMock.getSummary).toHaveBeenCalledWith('mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-03-01',
      dateTo: '2024-03-10',
    })

    expect(jobServiceMock.getTotalApplicationsByStage).toHaveBeenCalledWith('mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-03-01',
      dateTo: '2024-03-10',
    })

    expect(req.context.summary).toEqual(mockSummary)
    expect(req.context.applicationsByStage).toEqual(mockApplicationsByStage)
    expect(next).toHaveBeenCalledWith()
  })

  it('Handles invalid date format gracefully - Calls next with error', async () => {
    req.query.dateFrom = 'invalid-date'
    req.query.dateTo = '10/03/2024'

    await resolver(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error)
  })
})
