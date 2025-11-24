import expressMocks from '../../testutils/expressMocks'
import validationSchema from './validationSchema'
import DateError from '../../utils/errors'

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
      dateFrom: '15/09/2025',
      dateTo: '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_REQUIRED)
  })

  it('On validation error - should disallow dateTo without dateFrom', () => {
    req.body = {
      dateFrom: '',
      dateTo: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_REQUIRED)
  })

  it('On validation success - should allow valid dateFrom and dateTo', () => {
    req.body = {
      dateFrom: '15/08/2025',
      dateTo: '16/08/2025',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow dateTo being before dateFrom', () => {
    req.body = {
      dateFrom: '15/08/2025',
      dateTo: '14/08/2025',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_ORDER)
  })

  it('On validation error - should disallow an invalid dateFrom', () => {
    req.body = {
      dateFrom: 'invalid-date',
      dateTo: '16/09/2025',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_FORMAT)
  })

  it('On validation error - should disallow an invalid dateTo', () => {
    req.body = {
      dateFrom: '15/03/2024',
      dateTo: 'invalid-date',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_FORMAT)
  })

  it('On validation error - should disallow a future dateFrom', () => {
    const futureDate = '31/12/2099'
    req.body = {
      dateFrom: futureDate,
      dateTo: '01/09/2025',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_FUTURE)
  })

  it('On validation error - should disallow a future dateTo', () => {
    const futureDate = '31/12/2099'
    req.body = {
      dateFrom: '01/09/2025',
      dateTo: futureDate,
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_FUTURE)
  })

  it('Should allow dateFrom and dateTo as today’s date', () => {
    const today = new Date().toLocaleDateString('en-GB').padStart(10, '0')

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
    expect(error.details[0].message).toBe(DateError.DATE_FUTURE)
  })

  it('On validation error - should disallow a dateFrom before 1st August 2025', () => {
    const pastDate = '31/12/2024'
    req.body = {
      dateFrom: pastDate,
      dateTo: '01/09/2025',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_PAST)
  })

  it('On validation error - should disallow a dateTo before 1st August 2025', () => {
    const pastDate = '31/12/2024'
    req.body = {
      dateFrom: '01/09/2024',
      dateTo: pastDate,
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe(DateError.DATE_PAST)
  })
})
