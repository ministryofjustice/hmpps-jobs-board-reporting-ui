import { stubFor } from './wiremock'

const getJobSummary = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/summary`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        numberOfApplicants: 16,
        numberOfJobs: 12,
      },
    },
  })

const getTotalApplicationsByStage = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/applications-stage`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          applicationStatus: 'INTERVIEW_BOOKED',
          numberOfApplications: 6,
        },
        {
          applicationStatus: 'APPLICATION_MADE',
          numberOfApplications: 26,
        },
        {
          applicationStatus: 'APPLICATION_UNSUCCESSFUL',
          numberOfApplications: 16,
        },
        {
          applicationStatus: 'SELECTED_FOR_INTERVIEW',
          numberOfApplications: 10,
        },
        {
          applicationStatus: 'JOB_OFFER',
          numberOfApplications: 4,
        },
      ],
    },
  })

const getLatestApplicationsByStage = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/dashboard/applications-status`,
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: [
        {
          applicationStatus: 'APPLICATION_MADE',
          numberOfApplications: 29,
        },
        {
          applicationStatus: 'APPLICATION_UNSUCCESSFUL',
          numberOfApplications: 10,
        },
        {
          applicationStatus: 'INTERVIEW_BOOKED',
          numberOfApplications: 6,
        },
        {
          applicationStatus: 'JOB_OFFER',
          numberOfApplications: 14,
        },
      ],
    },
  })

export default {
  getJobSummary,
  getTotalApplicationsByStage,
  getLatestApplicationsByStage,
}
