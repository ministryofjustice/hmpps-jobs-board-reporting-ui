import HmppsAuthClient from '../data/hmppsAuthClient'
import WorkProfileApiClient from '../data/workProfileApi/workProfileApiClient'

export default class WorkProfileService {
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

    return new WorkProfileApiClient(systemToken).getWorkProfileSummary(params)
  }

  async getWorkStatusProgress(
    username: string,
    params: {
      prisonId: string
      dateFrom: string
      dateTo: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new WorkProfileApiClient(systemToken).getWorkStatusProgress(params)
  }

  async getSupportNeededDocuments(
    username: string,
    params: {
      prisonId: string
      dateFrom: string
      dateTo: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new WorkProfileApiClient(systemToken).getSupportNeededDocuments(params)
  }

  async getSupportToWorkDeclinedReasons(
    username: string,
    params: {
      prisonId: string
      dateFrom: string
      dateTo: string
    },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new WorkProfileApiClient(systemToken).getSupportToWorkDeclinedReasons(params)
  }
}
