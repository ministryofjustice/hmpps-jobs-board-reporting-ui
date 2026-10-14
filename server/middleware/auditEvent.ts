import type { RequestHandler } from 'express'
import AuditService, { EventName } from '../services/auditService'

const auditEvent =
  (auditService: AuditService, eventName: EventName): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = (req.method === 'POST' ? req.body : req.query) as {
      dateFrom?: string
      dateTo?: string
    }

    const attempt = await auditService.logAttempt(eventName, {
      who: res.locals.user.username,
      correlationId: req.id,
      details: { DATE_FROM: dateFrom, DATE_TO: dateTo },
    })

    res.on('finish', () =>
      (req.method === 'POST' ? res.statusCode === 302 : res.statusCode === 200) ? attempt.success() : attempt.failure(),
    )

    next()
  }

export default auditEvent
