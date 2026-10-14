import { EventEmitter } from 'events'
import type { Request, Response } from 'express'
import auditEvent from './auditEvent'
import AuditService, { EventName } from '../services/auditService'

jest.mock('../services/auditService')

describe('auditEvent', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const attempt = { success: jest.fn(), failure: jest.fn() }
  const next = jest.fn()

  let req: Request
  let res: Response

  beforeEach(() => {
    jest.resetAllMocks()
    auditService.logAttempt.mockResolvedValue(attempt)

    req = {
      id: 'request123',
      method: 'GET',
      query: { dateFrom: '01/01/2023', dateTo: '31/01/2023' },
      body: {},
    } as unknown as Request
    res = Object.assign(new EventEmitter(), {
      statusCode: 200,
      locals: { user: { username: 'user1' } },
    }) as unknown as Response
  })

  it('logs an attempt for GET and calls next', async () => {
    await auditEvent(auditService, EventName.VIEW_GSRW_REPORTING_PAGE)(req, res, next)

    expect(auditService.logAttempt).toHaveBeenCalledWith(EventName.VIEW_GSRW_REPORTING_PAGE, {
      who: 'user1',
      correlationId: 'request123',
      details: { DATE_FROM: '01/01/2023', DATE_TO: '31/01/2023' },
    })
    expect(next).toHaveBeenCalledWith()
    expect(attempt.success).not.toHaveBeenCalled()
    expect(attempt.failure).not.toHaveBeenCalled()
  })

  it('logs success for GET when the response finishes with a 200', async () => {
    await auditEvent(auditService, EventName.VIEW_GSRW_REPORTING_PAGE)(req, res, next)

    res.emit('finish')

    expect(attempt.success).toHaveBeenCalledTimes(1)
    expect(attempt.failure).not.toHaveBeenCalled()
  })

  it.each([302, 404, 500])('logs failure when the GET response finishes with a %i', async statusCode => {
    await auditEvent(auditService, EventName.VIEW_GSRW_REPORTING_PAGE)(req, res, next)

    res.statusCode = statusCode
    res.emit('finish')

    expect(attempt.failure).toHaveBeenCalledTimes(1)
    expect(attempt.success).not.toHaveBeenCalled()
  })

  describe('POST', () => {
    beforeEach(() => {
      req = {
        id: 'request123',
        method: 'POST',
        query: {},
        body: { dateFrom: '01/02/2023', dateTo: '28/02/2023' },
      } as unknown as Request
    })

    it('logs an attempt using dates from the body and calls next', async () => {
      await auditEvent(auditService, EventName.SEARCH_GSRW_DATE_FILTER)(req, res, next)

      expect(auditService.logAttempt).toHaveBeenCalledWith(EventName.SEARCH_GSRW_DATE_FILTER, {
        who: 'user1',
        correlationId: 'request123',
        details: { DATE_FROM: '01/02/2023', DATE_TO: '28/02/2023' },
      })
      expect(next).toHaveBeenCalledWith()
      expect(attempt.success).not.toHaveBeenCalled()
      expect(attempt.failure).not.toHaveBeenCalled()
    })

    it('logs success when the response finishes with a 302', async () => {
      await auditEvent(auditService, EventName.SEARCH_GSRW_DATE_FILTER)(req, res, next)

      res.statusCode = 302
      res.emit('finish')

      expect(attempt.success).toHaveBeenCalledTimes(1)
      expect(attempt.failure).not.toHaveBeenCalled()
    })

    it.each([200, 400, 500])('logs failure when the response finishes with a %i', async statusCode => {
      await auditEvent(auditService, EventName.SEARCH_GSRW_DATE_FILTER)(req, res, next)

      res.statusCode = statusCode
      res.emit('finish')

      expect(attempt.failure).toHaveBeenCalledTimes(1)
      expect(attempt.success).not.toHaveBeenCalled()
    })
  })
})
