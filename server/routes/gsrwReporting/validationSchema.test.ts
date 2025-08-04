import { parse } from 'date-fns'
import expressMocks from '../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()
  const schema = validationSchema()

  it('On validation success - should allow both dates to be empty', () => {
    req.body = {
      dateFrom: '',
      dateTo: '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow dateFrom without dateTo', () => {
    req.body = {
      dateFrom: '15/03/2024',
      dateTo: '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter or select a `latest` date')
  })

  it('On validation error - should disallow dateTo without dateFrom', () => {
    req.body = {
      dateFrom: '',
      dateTo: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter or select a `earliest` date')
  })

  it('On validation success - should allow valid dateFrom and dateTo', () => {
    req.body = {
      dateFrom: '15/03/2024',
      dateTo: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow dateTo being before dateFrom', () => {
    req.body = {
      dateFrom: '15/03/2024',
      dateTo: '14/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("The `latest` date must be after the 'earliest' date")
  })

  it('On validation error - should disallow an invalid dateFrom', () => {
    req.body = {
      dateFrom: 'invalid-date',
      dateTo: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter the date in the correct format')
  })

  it('On validation error - should disallow an invalid dateTo', () => {
    req.body = {
      dateFrom: '15/03/2024',
      dateTo: 'invalid-date',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter the date in the correct format')
  })

  it('On validation error - should disallow a future dateFrom', () => {
    const futureDate = '31/12/2099'
    req.body = {
      dateFrom: futureDate,
      dateTo: '01/01/2025', // valid past date
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Dates must not be in the future')
  })

  it('On validation error - should disallow a future dateTo', () => {
    const futureDate = '31/12/2099'
    req.body = {
      dateFrom: '01/01/2025',
      dateTo: futureDate,
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Dates must not be in the future')
  })

  it('Should allow dateFrom and dateTo as today’s date', () => {
    const today = '01/01/2025'

    req.body = {
      dateFrom: today,
      dateTo: today,
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow both dateFrom and dateTo in the future', () => {
    req.body = {
      dateFrom: '01/01/2100',
      dateTo: '01/01/2100',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details.map(d => d.message)).toContain('Dates must not be in the future')
  })
})
