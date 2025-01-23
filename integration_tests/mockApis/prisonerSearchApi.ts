import { stubFor } from './wiremock'

const getPrisonersByReleaseDate = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/prisoner-search/release-date-by-prison?page=0&size=99999',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        numberOfElements: 50,
      },
    },
  })

export default {
  getPrisonersByReleaseDate,
}
