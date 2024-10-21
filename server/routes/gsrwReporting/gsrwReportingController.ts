import { RequestHandler } from 'express'

export default class MjmaReportingController {
  public get: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      res.render('pages/gsrwReporting/index')
    } catch (err) {
      next(err)
    }
  }
}
