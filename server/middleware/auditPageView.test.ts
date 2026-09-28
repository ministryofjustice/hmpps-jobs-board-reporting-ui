import { EventEmitter } from 'events'
import type { Request, Response } from 'express'
import auditPageView from './auditPageView'
import AuditService, { Page } from '../services/auditService'

jest.mock('../services/auditService')

describe('auditPageView', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const pageViewAttempt = { success: jest.fn(), failure: jest.fn() }
  const next = jest.fn()

  let req: Request
  let res: Response

  beforeEach(() => {
    jest.resetAllMocks()
    auditService.logPageViewAttempt.mockResolvedValue(pageViewAttempt)

    req = { id: 'request123', query: { dateFrom: '01/01/2023', dateTo: '31/01/2023' } } as unknown as Request
    res = Object.assign(new EventEmitter(), {
      statusCode: 200,
      locals: { user: { username: 'user1' } },
    }) as unknown as Response
  })

  it('logs a page view attempt and calls next', async () => {
    await auditPageView(auditService, Page.GSRW_REPORTING_PAGE)(req, res, next)

    expect(auditService.logPageViewAttempt).toHaveBeenCalledWith(Page.GSRW_REPORTING_PAGE, {
      who: 'user1',
      correlationId: 'request123',
      details: { DATE_FROM: '01/01/2023', DATE_TO: '31/01/2023' },
    })
    expect(next).toHaveBeenCalledWith()
    expect(pageViewAttempt.success).not.toHaveBeenCalled()
    expect(pageViewAttempt.failure).not.toHaveBeenCalled()
  })

  it('logs success when the response finishes with a 200', async () => {
    await auditPageView(auditService, Page.GSRW_REPORTING_PAGE)(req, res, next)

    res.emit('finish')

    expect(pageViewAttempt.success).toHaveBeenCalledTimes(1)
    expect(pageViewAttempt.failure).not.toHaveBeenCalled()
  })

  it.each([302, 404, 500])('logs failure when the response finishes with a %i', async statusCode => {
    await auditPageView(auditService, Page.GSRW_REPORTING_PAGE)(req, res, next)

    res.statusCode = statusCode
    res.emit('finish')

    expect(pageViewAttempt.failure).toHaveBeenCalledTimes(1)
    expect(pageViewAttempt.success).not.toHaveBeenCalled()
  })
})
