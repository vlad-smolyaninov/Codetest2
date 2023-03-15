import { Coordinates, Enemy, IScan } from './RadarTypes'

export default class RadarTarget {
  public params: IScan

  public constructor(params: IScan) {
    this.params = params
  }

  public isMech(): boolean {
    const { enemies } = this.params
    return enemies.type === Enemy.mech
  }

  public isWithAllies(): boolean {
    const { allies = 0 } = this.params
    return allies >= 1
  }

  public getDistance(): number {
    const { coordinates } = this.params
    return Math.sqrt(coordinates.x ** 2 + coordinates.y ** 2)
  }

  public getCoordinates(): Coordinates {
    return this.params.coordinates
  }

  public isCloserThan(nextTarget: RadarTarget): boolean {
    return this.getDistance() < nextTarget.getDistance()
  }
}
