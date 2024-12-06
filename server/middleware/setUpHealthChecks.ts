import express, { Router, Request, Response } from 'express'

import healthcheck from '../services/healthCheck'
import type { ApplicationInfo } from '../applicationInfo'

export default function setUpHealthChecks(applicationInfo: ApplicationInfo): Router {
  const router: Router = express.Router()

  router.get('/health', (req, res, next) => {
    healthcheck(applicationInfo, result => {
      if (result.status !== 'UP') {
        res.status(503)
      }
      res.json(result)
    })
  })

  router.get('/ping', (req: Request, res: Response) =>
    res.send({
      status: 'UP',
    }),
  )

  router.get('/info', (req, res) => {
    res.json({
      git: {
        branch: applicationInfo.branchName,
      },
      build: {
        artifact: applicationInfo.applicationName,
        version: applicationInfo.buildNumber,
        name: applicationInfo.applicationName,
      },
      productId: applicationInfo.productId,
    })
  })

  return router
}
