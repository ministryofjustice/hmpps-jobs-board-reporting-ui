import WorkProfileService from '../../../services/workProfileService'

const getSupportNeededDocuments = async (
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
    return await workProfileService.getSupportNeededDocuments(username, params)
  } catch (err) {
    // Handle no data
    if (err?.status === 404 || err?.status === 500) {
      return [
        {
          actionTodo: 'BANK_ACCOUNT',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'CV_AND_COVERING_LETTER',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'DISCLOSURE_LETTER',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'EMAIL',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'HOUSING',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'ID',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'PHONE',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
      ]
    }

    throw err
  }
}

export default getSupportNeededDocuments
