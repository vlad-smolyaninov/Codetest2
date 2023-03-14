import { Coordinates, Enemy, IRadar, IScan, Protocol } from './RadarTypes'
import { MAX_DISTANCE } from './RadarConstants'
import RadarHelpers from './RadarHelpers'

export default class RadarTargetCalculator {
  private protocols: Protocol[] = []

  public calculateTarget(data: IRadar): Coordinates | undefined {
    this.protocols = data.protocols

    let bestTarget: IScan | undefined
    for (const target of data.scan) {
      if (!this.isInRange(target.coordinates)) continue

      if (this.isAvoidMech(target)) continue
      if (this.isAvoidCrossfire(target)) continue

      if (this.isPrioritizeMech(bestTarget, target)) continue
      if (this.isPrioritizeMech(target, bestTarget)) bestTarget = target

      if (this.isPrioritizeAssist(bestTarget, target)) continue
      if (this.isPrioritizeAssist(target, bestTarget)) bestTarget = target

      if (this.isPrioritizeClosest(target, bestTarget)) continue
      if (this.isPrioritizeFurthest(target, bestTarget)) continue

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
      target1EnemyType === Enemy.mech && target2EnemyType !== Enemy.mech && this.hasProtocol(Protocol.prioritizeMech)
    )
  }

  private isPrioritizeAssist(target1: IScan | undefined, target2: IScan | undefined): boolean {
    const target1Allies = target1?.allies ?? 0
    const target2Allies = target2?.allies ?? 0
    return target2Allies === 0 && target1Allies >= 1 && this.hasProtocol(Protocol.assistAllies)
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
