/* eslint-disable @typescript-eslint/no-explicit-any */
import getGsrwDashboardResolver from './getGsrwDashboardResolver'
import expressMocks from '../../testutils/expressMocks'
import logger from '../../../logger'
import getLastFullMonthStartDate from '../../utils/getLastFullMonthStartDate'
import getLastFullMonthEndDate from '../../utils/getLastFullMonthEndDate'
import getGsrwSummary from './utils/getGsrwSummary'
import getWorkStatusProgress from './utils/getWorkStatusProgress'
import getSupportNeededDocuments from './utils/getSupportNeededDocuments'
import getSupportToWorkDeclinedReasons from './utils/getSupportToWorkDeclinedReasons'

jest.mock('../../../logger')
jest.mock('../../utils/getLastFullMonthStartDate')
jest.mock('../../utils/getLastFullMonthEndDate')
jest.mock('./utils/getGsrwSummary')
jest.mock('./utils/getWorkStatusProgress')
jest.mock('./utils/getSupportNeededDocuments')
jest.mock('./utils/getSupportToWorkDeclinedReasons')

describe('getGsrwDashboardResolver', () => {
  const { req, res, next } = expressMocks()

  res.locals.user = { username: 'mock_username' }
  res.locals.userActiveCaseLoad = { caseLoadId: 'MDI' }
  req.query = { dateFrom: '01/01/2024', dateTo: '31/01/2024' }

  const prisonerSearchServiceMock = {
    getPrisonersByReleaseDateCount: jest.fn(),
  }

  const workProfileServiceMock = {}

  const resolver = getGsrwDashboardResolver(prisonerSearchServiceMock as any, workProfileServiceMock as any)

  const mockPrisonersCount = 100
  const mockSummary = { jobCount: 10 }
  const mockWorkStatusProgress = { progress: 'mock' }
  const mockSupportNeededDocuments = [{ actionTodo: 'BANK_ACCOUNT', numberOfPrisoners: 5 }]
  const mockSupportToWorkDeclinedReasons = [{ reason: 'NO_REASON', numberOfPrisoners: 3 }]
  const error = new Error('mock_error')

  beforeEach(() => {
    jest.resetAllMocks()
    ;(getLastFullMonthStartDate as jest.Mock).mockReturnValue(new Date('2023-12-01'))
    ;(getLastFullMonthEndDate as jest.Mock).mockReturnValue(new Date('2023-12-31'))
    ;(getGsrwSummary as jest.Mock).mockResolvedValue(mockSummary)
    ;(getWorkStatusProgress as jest.Mock).mockResolvedValue(mockWorkStatusProgress)
    ;(getSupportNeededDocuments as jest.Mock).mockResolvedValue(mockSupportNeededDocuments)
    ;(getSupportToWorkDeclinedReasons as jest.Mock).mockResolvedValue(mockSupportToWorkDeclinedReasons)
  })

  it('On error - Logs error and calls next with error', async () => {
    prisonerSearchServiceMock.getPrisonersByReleaseDateCount.mockRejectedValue(error)

    await resolver(req, res, next)

    expect(logger.error).toHaveBeenCalledWith('Error getting data - GSRW dashboard data')
    expect(next).toHaveBeenCalledWith(error)
  })

  it('On success - Populates req.context and calls next', async () => {
    prisonerSearchServiceMock.getPrisonersByReleaseDateCount.mockResolvedValue(mockPrisonersCount)

    await resolver(req, res, next)

    expect(prisonerSearchServiceMock.getPrisonersByReleaseDateCount).toHaveBeenCalledWith('mock_username', {
      prisonIds: ['MDI'],
      earliestReleaseDate: '2024-01-01',
      latestReleaseDate: '2024-04-24', // 12 weeks after 31/01/2024
    })

    expect(getGsrwSummary).toHaveBeenCalledWith(workProfileServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(getWorkStatusProgress).toHaveBeenCalledWith(workProfileServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(getSupportNeededDocuments).toHaveBeenCalledWith(workProfileServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(getSupportToWorkDeclinedReasons).toHaveBeenCalledWith(workProfileServiceMock, 'mock_username', {
      prisonId: 'MDI',
      dateFrom: '2024-01-01',
      dateTo: '2024-01-31',
    })

    expect(req.context.numberOfPrisonersWithin12Weeks).toEqual(mockPrisonersCount)
    expect(req.context.numberOfPrisonersOver12Weeks).toEqual(0)
    expect(req.context.numberOfPrisonersAll).toEqual(mockPrisonersCount)
    expect(req.context.summary).toEqual(mockSummary)
    expect(req.context.workStatusProgress).toEqual(mockWorkStatusProgress)
    expect(req.context.supportNeededDocuments).toEqual(mockSupportNeededDocuments)
    expect(req.context.supportToWorkDeclinedReasons).toEqual(mockSupportToWorkDeclinedReasons)

    expect(next).toHaveBeenCalledWith()
  })

  it('Handles missing date params - Uses default dates', async () => {
    delete req.query.dateFrom
    delete req.query.dateTo

    prisonerSearchServiceMock.getPrisonersByReleaseDateCount.mockResolvedValue(mockPrisonersCount)

    await resolver(req, res, next)

    expect(getLastFullMonthStartDate).toHaveBeenCalled()
    expect(getLastFullMonthEndDate).toHaveBeenCalled()
    expect(prisonerSearchServiceMock.getPrisonersByReleaseDateCount).toHaveBeenCalledWith('mock_username', {
      prisonIds: ['MDI'],
      earliestReleaseDate: '2023-12-01',
      latestReleaseDate: '2024-03-24', // 12 weeks after 31/12/2023
    })

    expect(next).toHaveBeenCalledWith()
  })

  it('Handles invalid date format gracefully - Calls next with error', async () => {
    req.query.dateFrom = 'invalid-date'
    req.query.dateTo = '31/01/2024'

    await resolver(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(next.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(next.mock.calls[0][0].message).toContain('Invalid time value')
  })
})
