import WorkProfileService from '../../../services/workProfileService'

const getSupportToWorkDeclinedReasons = async (
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
    return await workProfileService.getSupportToWorkDeclinedReasons(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return [
        {
          supportToWorkDeclinedReason: 'ALREADY_HAS_WORK',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'LIMIT_THEIR_ABILITY',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'FULL_TIME_CARER',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'LACKS_CONFIDENCE_OR_MOTIVATION',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'HEALTH',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'NO_REASON',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'RETIRED',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'RETURNING_TO_JOB',
          numberOfPrisoners: 0,
        },
        {
          supportToWorkDeclinedReason: 'SELF_EMPLOYED',
          numberOfPrisoners: 0,
        },
      ]
    }

    throw err
  }
}

export default getSupportToWorkDeclinedReasons
