import HmppsAuthClient from '../data/hmppsAuthClient'
import JobApiClient from '../data/jobApi/jobApiClient'

export default class JobService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getSummary(
    username: string,
    params: {
      prisonId: string
      dateFrom: string
      dateTo: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getJobSummary(params)
  }

  async getTotalApplicationsByStage(
    username: string,
    params: {
      prisonId: string
      dateFrom: string
      dateTo: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new JobApiClient(systemToken).getTotalApplicationsByStage(params)
  }
}
