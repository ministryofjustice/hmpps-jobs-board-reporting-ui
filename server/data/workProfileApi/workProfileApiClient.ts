import config from '../../config'
import RestClient from '../restClient'
import SupportNeededDocumentsResults from './interfaces/supportNeededDocumentsResults'
import SupportToWorkDeclinedReasonsResults from './interfaces/supportToWorkDeclinedReasonsResults'
import WorkProfileSummaryResults from './interfaces/workProfileSummaryResults'
import WorkStatusProgressResults from './interfaces/workStatusProgressResults'

export default class WorkProfileApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Work profile API', config.apis.workProfileApi, token)
  }

  async getWorkProfileSummary(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    const results = await this.restClient.get<WorkProfileSummaryResults>({
      path: `/dashboard/summary?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    })

    return results
  }

  async getWorkStatusProgress(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    const results = await this.restClient.get<WorkStatusProgressResults>({
      path: `/dashboard/work-status?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    })

    return results
  }

  async getSupportNeededDocuments(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    const results = await this.restClient.get<Array<SupportNeededDocumentsResults>>({
      path: `/dashboard/documents-support-needed?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    })

    return results
  }

  async getSupportToWorkDeclinedReasons(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    const results = await this.restClient.get<Array<SupportToWorkDeclinedReasonsResults>>({
      path: `/dashboard/reasons-support-declined?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    })

    return results
  }
}
