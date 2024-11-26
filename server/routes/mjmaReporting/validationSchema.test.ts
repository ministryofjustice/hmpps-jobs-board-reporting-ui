import expressMocks from '../../testutils/expressMocks'
import validationSchema from './validationSchema'

describe('validationSchema', () => {
  const { req } = expressMocks()
  const schema = validationSchema()

  it('On validation success - should allow both dates to be empty', () => {
    req.body = {
      fromDate: '',
      toDate: '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow fromDate without toDate', () => {
    req.body = {
      fromDate: '15/03/2024',
      toDate: '',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter or select a `latest` date')
  })

  it('On validation error - should disallow toDate without fromDate', () => {
    req.body = {
      fromDate: '',
      toDate: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter or select a `earliest` date')
  })

  it('On validation success - should allow valid fromDate and toDate', () => {
    req.body = {
      fromDate: '15/03/2024',
      toDate: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeFalsy()
  })

  it('On validation error - should disallow toDate being before fromDate', () => {
    req.body = {
      fromDate: '15/03/2024',
      toDate: '14/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe("The `latest` date must be after the 'earliest' date")
  })

  it('On validation error - should disallow an invalid fromDate', () => {
    req.body = {
      fromDate: 'invalid-date',
      toDate: '16/03/2024',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter the date in the correct format')
  })

  it('On validation error - should disallow an invalid toDate', () => {
    req.body = {
      fromDate: '15/03/2024',
      toDate: 'invalid-date',
    }

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })

    expect(error).toBeTruthy()
    expect(error.details[0].message).toBe('Enter the date in the correct format')
  })
})
