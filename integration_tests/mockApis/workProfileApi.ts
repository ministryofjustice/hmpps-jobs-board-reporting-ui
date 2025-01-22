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
        numberOfPrisoners: 34,
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
            numberOfPrisoners: 21,
          },
          {
            profileStatus: 'SUPPORT_DECLINED',
            numberOfPrisoners: 16,
          },
          {
            profileStatus: 'SUPPORT_NEEDED',
            numberOfPrisoners: 22,
          },
          {
            profileStatus: 'READY_TO_WORK',
            numberOfPrisoners: 12,
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
          numberOfPrisoners: 2,
        },
        {
          actionTodo: 'CV_AND_COVERING_LETTER',
          numberOfPrisoners: 22,
        },
        {
          actionTodo: 'DISCLOSURE_LETTER',
          numberOfPrisoners: 12,
        },
        {
          actionTodo: 'EMAIL',
          numberOfPrisoners: 8,
        },
        {
          actionTodo: 'HOUSING',
          numberOfPrisoners: 21,
        },
        {
          actionTodo: 'ID',
          numberOfPrisoners: 18,
        },
        {
          actionTodo: 'PHONE',
          numberOfPrisoners: 8,
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
          numberOfPrisoners: 4,
        },
        {
          supportToWorkDeclinedReason: 'LIMIT_THEIR_ABILITY',
          numberOfPrisoners: 12,
        },
        {
          supportToWorkDeclinedReason: 'FULL_TIME_CARER',
          numberOfPrisoners: 4,
        },
        {
          supportToWorkDeclinedReason: 'HOUSING_NOT_IN_PLACE',
          numberOfPrisoners: 11,
        },
        {
          supportToWorkDeclinedReason: 'LACKS_CONFIDENCE_OR_MOTIVATION',
          numberOfPrisoners: 3,
        },
        {
          supportToWorkDeclinedReason: 'HEALTH',
          numberOfPrisoners: 4,
        },
        {
          supportToWorkDeclinedReason: 'NO_REASON',
          numberOfPrisoners: 2,
        },
        {
          supportToWorkDeclinedReason: 'RETIRED',
          numberOfPrisoners: 7,
        },
        {
          supportToWorkDeclinedReason: 'RETURNING_TO_JOB',
          numberOfPrisoners: 2,
        },
        {
          supportToWorkDeclinedReason: 'SELF_EMPLOYED',
          numberOfPrisoners: 13,
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
