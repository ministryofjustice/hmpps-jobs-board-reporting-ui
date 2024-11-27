import { stubFor } from './wiremock'

const getJobSummary = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/summary`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        numberOfApplicants: 16,
        numberOfJobs: 12,
      },
    },
  })

export default {
  getJobSummary,
}
