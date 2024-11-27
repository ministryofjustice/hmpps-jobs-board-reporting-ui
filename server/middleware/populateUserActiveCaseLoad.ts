import { RequestHandler } from 'express'
import UserService from '../services/userService'

// Adds the users current active case load to the res.locals for the breadcrumbs
const populateUserActiveCaseLoad = (userService: UserService): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userActiveCaseLoad = await userService.getUserActiveCaseLoad(res.locals.user.token)

      res.locals.userActiveCaseLoad = userActiveCaseLoad

      next()
    } catch (err) {
      next(err)
    }
  }
}

export default populateUserActiveCaseLoad
