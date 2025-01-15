import config from '../../config'
import RestClient from '../restClient'
import SupportNeededDocumentsResults from './interfaces/supportNeededDocumentsResults'
import SupportToWorkDeclinedReasonsResults from './interfaces/supportToWorkDeclinedReasonsResults'
import WorkProfileSummaryResults from './interfaces/workProfileSummaryResults'
import WorkStatusProgressResults from './interfaces/workStatusProgressResults'

export default class WorkProfileApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job API', config.apis.workProfileApi, token)
  }

  async getWorkProfileSummary(_params: { prisonId: string; dateFrom: string; dateTo: string }) {
    // const { prisonId, dateFrom, dateTo } = params

    // const results = await this.restClient.get<WorkProfileSummaryResults>({
    //   path: `/dashboard/summary?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results: WorkProfileSummaryResults = {
      numberOfPrisoners: 34,
      numberOfSupportDeclinded: 16,
      numberOfNoRightToWork: 21,
    }

    return results
  }

  async getWorkStatusProgress(_params: { prisonId: string; dateFrom: string; dateTo: string }) {
    // const { prisonId, dateFrom, dateTo } = params

    // const results = await this.restClient.get<WorkStatusProgressResults>({
    //   path: `/dashboard/work-status?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results: WorkStatusProgressResults = {
      numberOfPrisonersStatusChange: 21,
      statusCounts: [
        {
          profileStatus: 'NO_RIGHT_TO_WORK',
          numberOfPrisoners: 21,
        },
        {
          profileStatus: 'SUPPORT_DECLINED',
          numberOfPrisoners: 16,
        },
        {
          profileStatus: 'SUPPORT_NEEDED',
          numberOfPrisoners: 22,
        },
        {
          profileStatus: 'READY_TO_WORK',
          numberOfPrisoners: 12,
        },
      ],
    }

    return results
  }

  async getSupportNeededDocuments(_params: { prisonId: string; dateFrom: string; dateTo: string }) {
    // const { prisonId, dateFrom, dateTo } = params

    // const results = await this.restClient.get<Array<SupportNeededDocumentsResults>>({
    //   path: `/dashboard/work-status?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results: Array<SupportNeededDocumentsResults> = [
      {
        actionTodo: 'BANK_ACCOUNT',
        numberOfPrisoners: 2,
      },
      {
        actionTodo: 'CV_AND_COVERING_LETTER',
        numberOfPrisoners: 22,
      },
      {
        actionTodo: 'DISCLOSURE_LETTER',
        numberOfPrisoners: 12,
      },
      {
        actionTodo: 'EMAIL',
        numberOfPrisoners: 8,
      },
      {
        actionTodo: 'HOUSING',
        numberOfPrisoners: 21,
      },
      {
        actionTodo: 'ID',
        numberOfPrisoners: 18,
      },
      {
        actionTodo: 'PHONE',
        numberOfPrisoners: 8,
      },
    ]

    return results
  }

  async getSupportToWorkDeclinedReasons(_params: { prisonId: string; dateFrom: string; dateTo: string }) {
    // const { prisonId, dateFrom, dateTo } = params

    // const results = await this.restClient.get<Array<SupportToWorkDeclinedReasonsResults>>({
    //   path: `/dashboard/work-status?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results: Array<SupportToWorkDeclinedReasonsResults> = [
      {
        supportToWorkDeclinedReason: 'ALREADY_HAS_WORK',
        numberOfPrisoners: 4,
      },
      {
        supportToWorkDeclinedReason: 'LIMIT_THEIR_ABILITY',
        numberOfPrisoners: 12,
      },
      {
        supportToWorkDeclinedReason: 'FULL_TIME_CARER',
        numberOfPrisoners: 4,
      },
      {
        supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE',
        numberOfPrisoners: 11,
      },
      {
        supportToWorkDeclinedReason: 'LACKS_CONFIDENCE_OR_MOTIVATION',
        numberOfPrisoners: 3,
      },
      {
        supportToWorkDeclinedReason: 'HEALTH',
        numberOfPrisoners: 4,
      },
      {
        supportToWorkDeclinedReason: 'NO_REASON',
        numberOfPrisoners: 2,
      },
      {
        supportToWorkDeclinedReason: 'RETIRED',
        numberOfPrisoners: 7,
      },
      {
        supportToWorkDeclinedReason: 'RETURNING_TO_JOB',
        numberOfPrisoners: 2,
      },
      {
        supportToWorkDeclinedReason: 'SELF_EMPLOYED',
        numberOfPrisoners: 13,
      },
    ]

    return results
  }
}
