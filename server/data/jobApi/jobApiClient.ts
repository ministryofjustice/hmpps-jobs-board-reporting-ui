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

    // const results = await this.restClient.get<JobSummaryResults>({
    //   path: `/dashboard/summary?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results = {
      numberOfApplicants: 16,
      numberOfJobs: 12,
    }

    return results
  }

  async getTotalApplicationsByStage(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    // const results = await this.restClient.get<JobSummaryResults>({
    //   path: `/dashboard/application-stage?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results = [
      {
        applicationStatus: 'APPLICATION_MADE',
        numberOfApplications: 26,
      },
      {
        applicationStatus: 'APPLICATION_UNSUCCESSFUL',
        numberOfApplications: 16,
      },
      {
        applicationStatus: 'SELECTED_FOR_INTERVIEW',
        numberOfApplications: 10,
      },
      {
        applicationStatus: 'INTERVIEW_BOOKED',
        numberOfApplications: 6,
      },
      {
        applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW',
        numberOfApplications: 0,
      },
      {
        applicationStatus: 'JOB_OFFER',
        numberOfApplications: 4,
      },
    ]

    return results
  }

  async getLatestApplicationsByStage(params: { prisonId: string; dateFrom: string; dateTo: string }) {
    const { prisonId, dateFrom, dateTo } = params

    // const results = await this.restClient.get<JobSummaryResults>({
    //   path: `/dashboard/application-stage?prisonId=${prisonId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    // })

    const results = [
      {
        applicationStatus: 'APPLICATION_MADE',
        numberOfApplications: 29,
      },
      {
        applicationStatus: 'APPLICATION_UNSUCCESSFUL',
        numberOfApplications: 10,
      },
      {
        applicationStatus: 'SELECTED_FOR_INTERVIEW',
        numberOfApplications: 0,
      },
      {
        applicationStatus: 'INTERVIEW_BOOKED',
        numberOfApplications: 6,
      },
      {
        applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW',
        numberOfApplications: 0,
      },
      {
        applicationStatus: 'JOB_OFFER',
        numberOfApplications: 14,
      },
    ]

    return results
  }
}
