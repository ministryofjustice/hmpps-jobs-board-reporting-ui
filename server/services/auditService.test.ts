import AuditService, { EventName } from './auditService'
import HmppsAuditClient from '../data/hmppsAuditClient'

jest.mock('../data/hmppsAuditClient')

describe('Audit service', () => {
  let hmppsAuditClient: jest.Mocked<HmppsAuditClient>
  let auditService: AuditService

  beforeEach(() => {
    hmppsAuditClient = new HmppsAuditClient(null) as jest.Mocked<HmppsAuditClient>
    auditService = new AuditService(hmppsAuditClient)
  })

  describe('logAttempt', () => {
    it('sends attempt audit message using audit client', async () => {
      await auditService.logAttempt(EventName.VIEW_GSRW_REPORTING_PAGE, {
        who: 'user1',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'VIEW_GSRW_REPORTING_PAGE_ATTEMPT',
          who: 'user1',
          subjectType: 'NOT_APPLICABLE',
          subjectId: 'NONE',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        false,
      )
    })

    it('sends success audit message using audit client', async () => {
      const attempt = await auditService.logAttempt(EventName.VIEW_GSRW_REPORTING_PAGE, {
        who: 'user1',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
      await attempt.success()

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'VIEW_GSRW_REPORTING_PAGE_SUCCESS',
          who: 'user1',
          subjectType: 'NOT_APPLICABLE',
          subjectId: 'NONE',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        false,
      )
    })

    it('sends failure audit message using audit client', async () => {
      const attempt = await auditService.logAttempt(EventName.VIEW_GSRW_REPORTING_PAGE, {
        who: 'user1',
        correlationId: 'request123',
        details: { extraDetails: 'example' },
      })
      await attempt.failure()

      expect(hmppsAuditClient.sendMessage).toHaveBeenCalledWith(
        {
          what: 'VIEW_GSRW_REPORTING_PAGE_FAILURE',
          who: 'user1',
          subjectType: 'NOT_APPLICABLE',
          subjectId: 'NONE',
          correlationId: 'request123',
          details: { extraDetails: 'example' },
        },
        false,
      )
    })
  })
})
