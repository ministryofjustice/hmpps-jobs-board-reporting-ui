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
          numberOfPrisoners: 0,
        },
        {
          actionTodo: 'CV_AND_COVERING_LETTER',
          numberOfPrisoners: 0,
        },
        {
          actionTodo: 'DISCLOSURE_LETTER',
          numberOfPrisoners: 0,
        },
        {
          actionTodo: 'EMAIL',
          numberOfPrisoners: 0,
        },
        {
          actionTodo: 'HOUSING',
          numberOfPrisoners: 0,
        },
        {
          actionTodo: 'ID',
          numberOfPrisoners: 0,
        },
        {
          actionTodo: 'PHONE',
          numberOfPrisoners: 0,
        },
      ]
    }

    throw err
  }
}

export default getSupportNeededDocuments
