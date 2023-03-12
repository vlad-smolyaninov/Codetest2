import { Router } from 'express'
import RadarController from './api/radar/RadarController'
import statusCodes from 'http-status-codes'

export default function routes(): Router {
  const router = Router()

  // API controllers
  const radarController = new RadarController()

  // API routes
  router.use(radarController.register())

  router.use(function (req, res) {
    res.status(statusCodes.NOT_FOUND).json({ error: 'Not found' })
  })

  return router
}
