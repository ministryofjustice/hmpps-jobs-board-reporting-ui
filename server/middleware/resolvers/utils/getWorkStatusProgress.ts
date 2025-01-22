import WorkProfileService from '../../../services/workProfileService'

const getWorkStatusProgress = async (
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
    return await workProfileService.getWorkStatusProgress(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return {
        numberOfPrisonersStatusChange: 0,
        statusCounts: [
          {
            profileStatus: 'NO_RIGHT_TO_WORK',
            numberOfPrisoners: 0,
          },
          {
            profileStatus: 'SUPPORT_DECLINED',
            numberOfPrisoners: 0,
          },
          {
            profileStatus: 'SUPPORT_NEEDED',
            numberOfPrisoners: 0,
          },
          {
            profileStatus: 'READY_TO_WORK',
            numberOfPrisoners: 0,
          },
        ],
      }
    }

    throw err
  }
}

export default getWorkStatusProgress
