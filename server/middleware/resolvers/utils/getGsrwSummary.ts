import WorkProfileService from '../../../services/workProfileService'

const getGsrwSummary = async (
  workProfileService: WorkProfileService,
  username: string,
  params: {
    prisonId: string
    dateFrom: string
    dateTo: string
  },
) => {
  try {
    // Get data
    return await workProfileService.getSummary(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        numberOfPrisoners: 0,
        numberOfSupportDeclined: 0,
        numberOfNoRightToWork: 0,
      }
    }

    throw err
  }
}

export default getGsrwSummary
