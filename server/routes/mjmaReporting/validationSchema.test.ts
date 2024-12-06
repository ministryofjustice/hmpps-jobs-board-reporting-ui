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
})
