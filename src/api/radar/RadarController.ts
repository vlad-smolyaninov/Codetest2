import { NextFunction, Request, Response, Router } from 'express'
import BaseApi from '../BaseApi'
import Validator from '../../lib/Validator'
import { radarSchema } from './RadarSchema'
import RadarTargetCalculator from './RadarTargetCalculator'

export default class RadarController extends BaseApi {
  public validator: Validator
  public targetCalculator: RadarTargetCalculator

  constructor() {
    super()
    this.validator = new Validator()
    this.targetCalculator = new RadarTargetCalculator()
  }

  public register(): Router {
    this.validator.addSchema('radar', radarSchema)

    this.router.post('/radar', this.getRadar.bind(this))
    return this.router
  }

  public getRadar(req: Request, res: Response, next: NextFunction): void {
    try {
      const data = req.body
      this.validator.validate('radar', data)
      const target = this.targetCalculator.calculateTarget(data)

      res.send(target ? { x: target.x, y: target.y } : { error: 'No target found' })
    } catch (error) {
      next(error)
    }
  }
}
