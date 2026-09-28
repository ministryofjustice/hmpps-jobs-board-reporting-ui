import type { RequestHandler } from 'express'
import AuditService, { Page } from '../services/auditService'

const auditPageView =
  (auditService: AuditService, page: Page): RequestHandler =>
  async (req, res, next): Promise<void> => {
    const { dateFrom, dateTo } = req.query as { dateFrom?: string; dateTo?: string }

    const pageViewAttempt = await auditService.logPageViewAttempt(page, {
      who: res.locals.user.username,
      correlationId: req.id,
      details: { DATE_FROM: dateFrom, DATE_TO: dateTo },
    })

    res.on('finish', () => (res.statusCode === 200 ? pageViewAttempt.success() : pageViewAttempt.failure()))

    next()
  }

export default auditPageView
