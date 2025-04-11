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
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'LIMIT_THEIR_ABILITY',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'FULL_TIME_CARER',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'LACKS_CONFIDENCE_OR_MOTIVATION',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'HEALTH',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'NO_REASON',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'RETIRED',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'RETURNING_TO_JOB',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'SELF_EMPLOYED',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
      ]
    }

    throw err
  }
}

export default getSupportToWorkDeclinedReasons
