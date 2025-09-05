import config from '../../config'
import PagedResponse from '../domain/types/pagedResponse'
import RestClient from '../restClient'

// Match prisoners who have a release date within a range, and optionally by prison
const PRISONER_SEARCH_BY_RELEASE_DATE = '/prisoner-search/release-date-by-prison'

export default class PrisonerSearchApiClient {
  restClient: RestClient

  newToken: string

  constructor(token: string) {
    this.restClient = new RestClient('Prisoner Search', config.apis.prisonerSearch, token)

    this.newToken = token
  }

  async getPrisonersByReleaseDateCount(earliestReleaseDate: string, latestReleaseDate: string, prisonIds: string[]) {
    const results = await this.restClient.post<PagedResponse<unknown>>({
      path: `${PRISONER_SEARCH_BY_RELEASE_DATE}?page=0&size=9999`,
      data: {
        earliestReleaseDate,
        latestReleaseDate,
        prisonIds,
      },
    })

    return results.numberOfElements
  }
}
