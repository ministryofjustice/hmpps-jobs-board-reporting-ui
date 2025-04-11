/* eslint-disable @typescript-eslint/no-explicit-any */
import getSupportNeededDocuments from './getSupportNeededDocuments'

describe('getSupportNeededDocuments', () => {
  const username = 'mock_username'
  const params = {
    prisonId: 'mock_prison_id',
    dateFrom: '2025-01-01',
    dateTo: '2025-01-14',
  }

  const mockData = [
    {
      actionTodo: 'BANK_ACCOUNT',
      numberOfPrisoners: 5,
    },
    {
      actionTodo: 'CV_AND_COVERING_LETTER',
      numberOfPrisoners: 3,
    },
    {
      actionTodo: 'DISCLOSURE_LETTER',
      numberOfPrisoners: 2,
    },
  ]

  const serviceMock = {
    getSupportNeededDocuments: jest.fn(),
  }

  const error = new Error('mock_error')

  it('On error - Throws error', async () => {
    serviceMock.getSupportNeededDocuments.mockRejectedValue(error)

    try {
      await getSupportNeededDocuments(serviceMock as any, username, params)
    } catch (err) {
      expect(err).toEqual(error)
    }
  })

  it('On error - 404 - Returns default document actions', async () => {
    serviceMock.getSupportNeededDocuments.mockRejectedValue({
      status: 404,
    })

    const result = await getSupportNeededDocuments(serviceMock as any, username, params)

    expect(result).toEqual([
      {
        actionTodo: 'BANK_ACCOUNT',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
      {
        actionTodo: 'CV_AND_COVERING_LETTER',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
      {
        actionTodo: 'DISCLOSURE_LETTER',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
      {
        actionTodo: 'EMAIL',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
      {
        actionTodo: 'HOUSING',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
      {
        actionTodo: 'ID',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
      {
        actionTodo: 'PHONE',
        numberOfPrisonersOver12Weeks: 0,
        numberOfPrisonersWithin12Weeks: 0,
      },
    ])
  })

  it('On success - Returns correct data', async () => {
    serviceMock.getSupportNeededDocuments.mockResolvedValue(mockData)

    const result = await getSupportNeededDocuments(serviceMock as any, username, params)

    expect(result).toEqual(mockData)
  })
})
