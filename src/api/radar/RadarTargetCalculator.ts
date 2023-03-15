import { Coordinates, IRadar, Protocol } from './RadarTypes'
import { MAX_DISTANCE } from './RadarConstants'
import RadarTarget from './RadarTarget'

export default class RadarTargetCalculator {
  private protocols: Protocol[] = []

  public calculateTarget(data: IRadar): Coordinates | undefined {
    this.protocols = data.protocols
    const targets = data.scan.map((scan) => new RadarTarget(scan))

    let bestTarget: RadarTarget | undefined
    for (const target of targets) {
      switch (true) {
        case target.getDistance() > MAX_DISTANCE:
        case this.hasProtocol(Protocol.avoidMech) && target.isMech():
        case this.hasProtocol(Protocol.avoidCrossfire) && target.isWithAllies():
          continue
        case this.hasProtocol(Protocol.prioritizeMech) && target.isMech() && !bestTarget?.isMech():
        case this.hasProtocol(Protocol.assistAllies) && target.isWithAllies() && !bestTarget?.isWithAllies():
          bestTarget = target
          break
        case this.hasProtocol(Protocol.prioritizeMech) && !target.isMech() && bestTarget?.isMech():
        case this.hasProtocol(Protocol.assistAllies) && !target.isWithAllies() && bestTarget?.isWithAllies():
        case this.hasProtocol(Protocol.closestEnemies) && bestTarget && !target.isCloserThan(bestTarget as RadarTarget):
        case this.hasProtocol(Protocol.furthestEnemies) && bestTarget && target.isCloserThan(bestTarget as RadarTarget):
          continue
      }
      bestTarget = target
    }

    return bestTarget?.getCoordinates()
  }

  private hasProtocol(protocol: Protocol): boolean {
    return this.protocols.includes(protocol)
  }
}
