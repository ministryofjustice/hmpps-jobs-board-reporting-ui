/* eslint-disable @typescript-eslint/no-explicit-any */
import getMjmaDashboardResolver from './getMjmaDashboardResolver'
import expressMocks from '../../testutils/expressMocks'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import getMjmaSummary from './utils/getMjmaSummary'
import getTotalApplicationsByStage from './utils/getTotalApplicationsByStage'
import getLatestApplicationsByStage from './utils/getLatestApplicationsByStage'

// Mock dependencies
jest.mock('../../../logger')
jest.mock('../../utils/getLastFullMonthStartDate')
jest.mock('../../utils/getLastFullMonthEndDate')
jest.mock('./utils/getMjmaSummary')
jest.mock('./utils/getTotalApplicationsByStage')
jest.mock('./utils/getLatestApplicationsByStage')
jest.mock('../../services/jobService')

describe('getMjmaDashboardResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { caseLoadId: 'MDI' }
  req.query = { dateFrom: '01/01/2024', dateTo: '31/01/2024' }

  const jobServiceMock = {
    getSummary: jest.fn(),
    getTotalApplicationsByStage: jest.fn(),
    getLatestApplicationsByStage: jest.fn(),
  }

  const resolver = getMjmaDashboardResolver(jobServiceMock as any)

  const mockSummary = { summary: 'summaryData' }
  const mockTotalApplicationsByStage = { total: 'totalData' }
  const mockLatestApplicationsByStage = { latest: 'latestData' }
  const error = new Error('mock_error')

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getLastFullMonthStartDate as jest.Mock).mockReturnValue(new Date('2023-12-01'))
    ;(getLastFullMonthEndDate as jest.Mock).mockReturnValue(new Date('2023-12-31'))
    ;(getMjmaSummary as jest.Mock).mockResolvedValue(mockSummary)
    ;(getTotalApplicationsByStage as jest.Mock).mockResolvedValue(mockTotalApplicationsByStage)
    ;(getLatestApplicationsByStage as jest.Mock).mockResolvedValue(mockLatestApplicationsByStage)
  })

  it('On error - Logs error and calls next with error', async () => {
    ;(getMjmaSummary as jest.Mock).mockRejectedValue(error)

    await resolver(req as any, res as any, next)

    expect(logger.error).toHaveBeenCalledWith('Error getting data - MJMA dashboard data')
    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Populates req.context and calls next', async () => {
    await resolver(req as any, res as any, next)

    expect(getMjmaSummary).toHaveBeenCalledWith(jobServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(getTotalApplicationsByStage).toHaveBeenCalledWith(jobServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(getLatestApplicationsByStage).toHaveBeenCalledWith(jobServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(req.context.summary).toEqual(mockSummary)
    expect(req.context.totalApplicationsByStage).toEqual(mockTotalApplicationsByStage)
    expect(req.context.latestApplicationsByStage).toEqual(mockLatestApplicationsByStage)

    expect(next).toHaveBeenCalledWith()
  })

  it('Handles missing date params - Uses default dates', async () => {
    delete req.query.dateFrom
    delete req.query.dateTo

    await resolver(req as any, res as any, next)

    expect(getLastFullMonthStartDate).toHaveBeenCalled()
    expect(getLastFullMonthEndDate).toHaveBeenCalled()
    expect(getMjmaSummary).toHaveBeenCalledWith(jobServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2023-12-01',
      dateTo: '2023-12-31',
    })

    expect(getTotalApplicationsByStage).toHaveBeenCalledWith(jobServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2023-12-01',
      dateTo: '2023-12-31',
    })

    expect(getLatestApplicationsByStage).toHaveBeenCalledWith(jobServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2023-12-01',
      dateTo: '2023-12-31',
    })

    expect(next).toHaveBeenCalledWith()
  })

  it('Handles invalid date format gracefully - Calls next with error', async () => {
    req.query.dateFrom = 'invalid-date'
    req.query.dateTo = 'another-invalid-date'

    await resolver(req as any, res as any, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(next.mock.calls[0][0].message).toContain('Invalid time value')
  })
})
