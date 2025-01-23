import JobService from '../../../services/jobService'

const getLatestApplicationsByStage = async (
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
    return await jobService.getLatestApplicationsByStage(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404) {
      return [
        {
          applicationStatus: 'APPLICATION_MADE',
          numberOfApplications: 0,
        },
        {
          applicationStatus: 'APPLICATION_UNSUCCESSFUL',
          numberOfApplications: 0,
        },
        {
          applicationStatus: 'SELECTED_FOR_INTERVIEW',
          numberOfApplications: 0,
        },
        {
          applicationStatus: 'INTERVIEW_BOOKED',
          numberOfApplications: 0,
        },
        {
          applicationStatus: 'UNSUCCESSFUL_AT_INTERVIEW',
          numberOfApplications: 0,
        },
        {
          applicationStatus: 'JOB_OFFER',
          numberOfApplications: 0,
        },
      ]
    }

    throw err
  }
}

export default getLatestApplicationsByStage
