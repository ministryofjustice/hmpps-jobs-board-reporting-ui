import { stubFor } from './wiremock'

const getPrisonersByReleaseDate = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        totalElements: 50,
      },
    },
  })

export default {
  getPrisonersByReleaseDate,
}
