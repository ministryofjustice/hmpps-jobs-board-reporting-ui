import HmppsAuditClient, { AuditEvent } from '../data/hmppsAuditClient'

export enum EventName {
  VIEW_GSRW_REPORTING_PAGE = 'VIEW_GSRW_REPORTING_PAGE',
  VIEW_MJMA_REPORTING_PAGE = 'VIEW_MJMA_REPORTING_PAGE',
  SEARCH_GSRW_DATE_FILTER = 'SEARCH_GSRW_DATE_FILTER',
  SEARCH_MJMA_DATE_FILTER = 'SEARCH_MJMA_DATE_FILTER',
}

enum Suffix {
  ATTEMPT = 'ATTEMPT',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface EventDetails {
  who: string
  correlationId?: string
  details?: object
}

export interface Outcome {
  success(): Promise<void>
  failure(): Promise<void>
}

export default class AuditService {
  constructor(private readonly hmppsAuditClient: HmppsAuditClient) {}

  private async logEvent(eventName: EventName, suffix: Suffix, eventDetails: EventDetails) {
    const event: AuditEvent = {
      ...eventDetails,
      what: `${eventName}_${suffix}`,
      subjectType: 'NOT_APPLICABLE',
      subjectId: 'NONE',
    }
    await this.hmppsAuditClient.sendMessage(event, false)
  }

  async logAttempt(eventName: EventName, eventDetails: EventDetails): Promise<Outcome> {
    await this.logEvent(eventName, Suffix.ATTEMPT, eventDetails)

    return {
      success: () => this.logEvent(eventName, Suffix.SUCCESS, eventDetails),
      failure: () => this.logEvent(eventName, Suffix.FAILURE, eventDetails),
    }
  }
}
