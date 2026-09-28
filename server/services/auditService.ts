import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum Page {
  GSRW_REPORTING_PAGE = 'GSRW_REPORTING_PAGE',
  MJMA_REPORTING_PAGE = 'MJMA_REPORTING_PAGE',
}

enum Suffix {
  ATTEMPT = 'ATTEMPT',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface PageViewEventDetails {
  who: string
  correlationId?: string
  details?: object
}

export interface PageViewOutcome {
  success(): Promise<void>
  failure(): Promise<void>
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  private async logPageView(page: Page, suffix: Suffix, eventDetails: PageViewEventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `PAGE_VIEW_${page}_${suffix}`,
      subjectType: 'NOT_APPLICABLE',
    }
    await this.hmppsAuditClient.sendMessage(event, false)
  }

  async logPageViewAttempt(page: Page, eventDetails: PageViewEventDetails): Promise<PageViewOutcome> {
    await this.logPageView(page, Suffix.ATTEMPT, eventDetails)

    return {
      success: () => this.logPageView(page, Suffix.SUCCESS, eventDetails),
      failure: () => this.logPageView(page, Suffix.FAILURE, eventDetails),
    }
  }
}
