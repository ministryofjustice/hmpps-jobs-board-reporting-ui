import config from '../../config'
import RestClient from '../restClient'
import JobSummaryResults from './interfaces/jobSummaryResults'

export default class JobApiClient {
  restClient: RestClient

  constructor(token: string) {
    this.restClient = new RestClient('Job API', config.apis.jobApi, token)
  }

  async getJobSummary(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    const uri = [`prisonId=${prisonId}`, `dateFrom=${dateFrom}`, `dateTo=${dateTo}`].filter(val => !!val)

    const results = await this.restClient.get<JobSummaryResults>({
      path: `/dashboard/summary?${uri.join('&')}`,
    })

    return results
  }

  async getTotalApplicationsByStage(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    const uri = [`prisonId=${prisonId}`, `dateFrom=${dateFrom}`, `dateTo=${dateTo}`].filter(val => !!val)

    const results = await this.restClient.get<JobSummaryResults>({
      path: `/dashboard/application-stage?${uri.join('&')}`,
    })

    return results
  }
}
