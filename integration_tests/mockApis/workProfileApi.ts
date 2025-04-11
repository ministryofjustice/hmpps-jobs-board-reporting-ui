import { stubFor } from './wiremock'

const getWorkProfileSummary = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/summary`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        numberOfPrisonersWithin12Weeks: 34,
        numberOfPrisonersOver12Weeks: 6,
        numberOfSupportDeclined: 16,
        numberOfNoRightToWork: 21,
      },
    },
  })

const getWorkStatusProgress = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/work-status`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        numberOfPrisonersStatusChange: 21,
        statusCounts: [
          {
            profileStatus: 'NO_RIGHT_TO_WORK',
            numberOfPrisonersWithin12Weeks: 21,
            numberOfPrisonersOver12Weeks: 6,
          },
          {
            profileStatus: 'SUPPORT_DECLINED',
            numberOfPrisonersWithin12Weeks: 16,
            numberOfPrisonersOver12Weeks: 0,
          },
          {
            profileStatus: 'SUPPORT_NEEDED',
            numberOfPrisonersWithin12Weeks: 22,
            numberOfPrisonersOver12Weeks: 2,
          },
          {
            profileStatus: 'READY_TO_WORK',
            numberOfPrisonersWithin12Weeks: 12,
            numberOfPrisonersOver12Weeks: 1,
          },
        ],
      },
    },
  })

const getSupportNeededDocuments = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/documents-support-needed`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          actionTodo: 'BANK_ACCOUNT',
          numberOfPrisonersWithin12Weeks: 2,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'CV_AND_COVERING_LETTER',
          numberOfPrisonersWithin12Weeks: 22,
          numberOfPrisonersOver12Weeks: 3,
        },
        {
          actionTodo: 'DISCLOSURE_LETTER',
          numberOfPrisonersWithin12Weeks: 12,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'EMAIL',
          numberOfPrisonersWithin12Weeks: 8,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          actionTodo: 'HOUSING',
          numberOfPrisonersWithin12Weeks: 21,
          numberOfPrisonersOver12Weeks: 1,
        },
        {
          actionTodo: 'ID',
          numberOfPrisonersWithin12Weeks: 18,
          numberOfPrisonersOver12Weeks: 3,
        },
        {
          actionTodo: 'PHONE',
          numberOfPrisonersWithin12Weeks: 8,
          numberOfPrisonersOver12Weeks: 1,
        },
      ],
    },
  })

const getSupportToWorkDeclinedReasons = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/reasons-support-declined`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          supportToWorkDeclinedReason: 'ALREADY_HAS_WORK',
          numberOfPrisonersWithin12Weeks: 4,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'LIMIT_THEIR_ABILITY',
          numberOfPrisonersWithin12Weeks: 12,
          numberOfPrisonersOver12Weeks: 1,
        },
        {
          supportToWorkDeclinedReason: 'FULL_TIME_CARER',
          numberOfPrisonersWithin12Weeks: 4,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE',
          numberOfPrisonersWithin12Weeks: 11,
          numberOfPrisonersOver12Weeks: 2,
        },
        {
          supportToWorkDeclinedReason: 'LACKS_CONFIDENCE_OR_MOTIVATION',
          numberOfPrisonersWithin12Weeks: 3,
          numberOfPrisonersOver12Weeks: 1,
        },
        {
          supportToWorkDeclinedReason: 'HEALTH',
          numberOfPrisonersWithin12Weeks: 4,
          numberOfPrisonersOver12Weeks: 1,
        },
        {
          supportToWorkDeclinedReason: 'NO_REASON',
          numberOfPrisonersWithin12Weeks: 2,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'RETIRED',
          numberOfPrisonersWithin12Weeks: 7,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'RETURNING_TO_JOB',
          numberOfPrisonersWithin12Weeks: 2,
          numberOfPrisonersOver12Weeks: 0,
        },
        {
          supportToWorkDeclinedReason: 'SELF_EMPLOYED',
          numberOfPrisonersWithin12Weeks: 13,
          numberOfPrisonersOver12Weeks: 2,
        },
        {
          supportToWorkDeclinedReason: 'OTHER',
          numberOfPrisonersWithin12Weeks: 0,
          numberOfPrisonersOver12Weeks: 0,
        },
      ],
    },
  })

export default {
  getWorkProfileSummary,
  getWorkStatusProgress,
  getSupportNeededDocuments,
  getSupportToWorkDeclinedReasons,
}
