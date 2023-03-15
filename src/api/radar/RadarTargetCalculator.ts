import { Coordinates, Enemy, IRadar, IScan, Protocol } from './RadarTypes'
import { MAX_DISTANCE } from './RadarConstants'
import RadarHelpers from './RadarHelpers'

export default class RadarTargetCalculator {
  private protocols: Protocol[] = []

  public calculateTarget(data: IRadar): Coordinates | undefined {
    this.protocols = data.protocols

    let bestTarget: IScan | undefined
    for (const target of data.scan) {
      switch (true) {
        case !this.isInRange(target.coordinates):
        case this.isAvoidMech(target):
        case this.isAvoidCrossfire(target):
          continue
        case this.isPrioritizeMech(bestTarget, target):
        case this.isPrioritizeAssist(bestTarget, target):
          // find first prioritized target
          bestTarget = target
          break
        case this.isPrioritizeAssist(target, bestTarget):
        case this.isPrioritizeMech(target, bestTarget):
        case this.isPrioritizeClosest(target, bestTarget):
        case this.isPrioritizeFurthest(target, bestTarget):
          continue
      }
      bestTarget = target
    }

    return bestTarget?.coordinates
  }

  private isInRange(point: Coordinates): boolean {
    return RadarHelpers.calculateDistance(point) <= MAX_DISTANCE
  }

  private isPrioritizeMech(target1: IScan | undefined, target2: IScan | undefined): boolean {
    const target1EnemyType = target1?.enemies.type
    const target2EnemyType = target2?.enemies.type

    return (
      target1EnemyType !== Enemy.mech && target2EnemyType === Enemy.mech && this.hasProtocol(Protocol.prioritizeMech)
    )
  }

  private isPrioritizeAssist(target1: IScan | undefined, target2: IScan | undefined): boolean {
    const target1Allies = target1?.allies ?? 0
    const target2Allies = target2?.allies ?? 0
    return target1Allies === 0 && target2Allies >= 1 && this.hasProtocol(Protocol.assistAllies)
  }

  private isAvoidMech(target: IScan): boolean {
    return target.enemies.type === Enemy.mech && this.hasProtocol(Protocol.avoidMech)
  }

  private isAvoidCrossfire(target: IScan): boolean {
    return (target?.allies ?? 0) >= 1 && this.hasProtocol(Protocol.avoidCrossfire)
  }

  private isPrioritizeClosest(target: IScan, bestTarget: IScan | undefined): boolean {
    return Boolean(
      bestTarget &&
        RadarHelpers.isCloserToOrigin(bestTarget.coordinates, target.coordinates) &&
        this.hasProtocol(Protocol.closestEnemies),
    )
  }

  private isPrioritizeFurthest(target: IScan, bestTarget: IScan | undefined): boolean {
    return Boolean(
      bestTarget &&
        !RadarHelpers.isCloserToOrigin(bestTarget.coordinates, target.coordinates) &&
        this.hasProtocol(Protocol.furthestEnemies),
    )
  }

  private hasProtocol(protocol: Protocol): boolean {
    return this.protocols.includes(protocol)
  }
}
