import JobService from '../../../services/jobService'

const getMjmaSummary = async (
  jobService: JobService,
  username: string,
  params: {
    prisonId: string
    dateFrom: string
    dateTo: string
  },
) => {
  try {
    // Get data
    return await jobService.getSummary(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return {
        numberOfApplicants: 0,
        numberOfJobs: 0,
      }
    }

    throw err
  }
}

export default getMjmaSummary
