import AuditService, { Page } from './auditService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  let hmppsAuditClient: jest.Mocked<HmppsAuditClient>
  let auditService: AuditService

  beforeEach(() => {
    hmppsAuditClient = new HmppsAuditClient(null) as jest.Mocked<HmppsAuditClient>
    auditService = new AuditService(hmppsAuditClient)
  })

  describe('logPageViewAttempt', () => {
    it('sends page view attempt audit message using audit client', async () => {
      await auditService.logPageViewAttempt(Page.GSRW_REPORTING_PAGE, {
        who: 'user1',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_GSRW_REPORTING_PAGE_ATTEMPT',
          who: 'user1',
          subjectType: 'NOT_APPLICABLE',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        false,
      )
    })

    it('sends page view success audit message using audit client', async () => {
      const pageViewAttempt = await auditService.logPageViewAttempt(Page.GSRW_REPORTING_PAGE, {
        who: 'user1',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
      await pageViewAttempt.success()

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_GSRW_REPORTING_PAGE_SUCCESS',
          who: 'user1',
          subjectType: 'NOT_APPLICABLE',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        false,
      )
    })

    it('sends page view failure audit message using audit client', async () => {
      const pageViewAttempt = await auditService.logPageViewAttempt(Page.GSRW_REPORTING_PAGE, {
        who: 'user1',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
      await pageViewAttempt.failure()

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'PAGE_VIEW_GSRW_REPORTING_PAGE_FAILURE',
          who: 'user1',
          subjectType: 'NOT_APPLICABLE',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        false,
      )
    })
  })
})
