import HmppsAuthClient from '../data/hmppsAuthClient'
import PrisonerSearchApiClient from '../data/prisonerSearchApi/prisonerSearchApiClient'

export default class PrisonerSearchService {
  constructor(private readonly hmppsAuthClient: HmppsAuthClient) {}

  async getPrisonersByReleaseDateCount(
    username: string,
    params: { earliestReleaseDate: string; latestReleaseDate: string; prisonIds: string[] },
  ) {
    const systemToken = await this.hmppsAuthClient.getSystemClientToken(username)

    return new PrisonerSearchApiClient(systemToken).getPrisonersByReleaseDateCount(
      params.earliestReleaseDate,
      params.latestReleaseDate,
      params.prisonIds,
    )
  }
}
