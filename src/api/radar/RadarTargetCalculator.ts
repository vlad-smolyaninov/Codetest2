import { Coordinates, Enemy, IRadar, IScan, Protocol } from './RadarTypes'
import { MAX_DISTANCE } from './RadarConstants'

export default class RadarTargetCalculator {
  public static calculateDistance(point: Coordinates) {
    return Math.sqrt(point.x ** 2 + point.y ** 2)
  }

  public static isCloserToOrigin(point1: Coordinates, point2: Coordinates) {
    // Calculate the distance of each point from the origin using the Pythagorean theorem
    const distance1 = RadarTargetCalculator.calculateDistance(point1)
    const distance2 = RadarTargetCalculator.calculateDistance(point2)

    // Check which point is closer to the origin
    return distance1 < distance2
  }

  public calculateTarget(data: IRadar): Coordinates | undefined {
    const { protocols, scan } = data

    const isInRange = (point: Coordinates) => RadarTargetCalculator.calculateDistance(point) <= MAX_DISTANCE

    //A mech should be attacked if found. If not, any other type of target is valid.
    const shouldPrioritizeMech = (target: IScan, bestTarget: IScan | undefined) =>
      protocols.includes(Protocol.prioritizeMech) &&
      bestTarget?.enemies.type !== Enemy.mech &&
      target.enemies.type === Enemy.mech
    const shouldFollowMechPriority = (target: IScan, bestTarget: IScan | undefined) =>
      protocols.includes(Protocol.prioritizeMech) &&
      bestTarget?.enemies.type === Enemy.mech &&
      target.enemies.type !== Enemy.mech

    //Priority should be given to points where there are allies.
    const shouldPrioritizeAssist = (target: IScan, bestTarget: IScan | undefined) =>
      protocols.includes(Protocol.assistAllies) && (bestTarget?.allies ?? 0) === 0 && (target?.allies ?? 0) >= 1
    const shouldFollowAssistPriority = (target: IScan, bestTarget: IScan | undefined) =>
      protocols.includes(Protocol.assistAllies) && (bestTarget?.allies ?? 0) >= 1 && (target?.allies ?? 0) === 0

    //No mech-type enemy should be attacked.
    const shouldAvoidMech = (target: IScan) =>
      protocols.includes(Protocol.avoidMech) && target.enemies.type === Enemy.mech

    //No point where there is an ally should be attacked.
    const shouldAvoidCrossfire = (target: IScan) =>
      protocols.includes(Protocol.avoidCrossfire) && (target?.allies ?? 0) >= 1

    //The closest point where enemies are present should be prioritised.
    const shouldPrioritizeClosest = (target: IScan, bestTarget: IScan | undefined) =>
      protocols.includes(Protocol.closestEnemies) &&
      bestTarget &&
      RadarTargetCalculator.isCloserToOrigin(bestTarget.coordinates, target.coordinates)

    //Priority should be given to the furthest point where enemies are present.
    const shouldPrioritizeFurthest = (target: IScan, bestTarget: IScan | undefined) =>
      protocols.includes(Protocol.furthestEnemies) &&
      bestTarget &&
      !RadarTargetCalculator.isCloserToOrigin(bestTarget.coordinates, target.coordinates)

    let bestTarget: IScan | undefined
    for (const target of scan) {
      if (!isInRange(target.coordinates)) continue

      if (shouldAvoidMech(target)) continue
      if (shouldAvoidCrossfire(target)) continue

      if (shouldFollowMechPriority(target, bestTarget)) continue
      if (shouldPrioritizeMech(target, bestTarget)) bestTarget = target

      if (shouldFollowAssistPriority(target, bestTarget)) continue
      if (shouldPrioritizeAssist(target, bestTarget)) bestTarget = target

      if (shouldPrioritizeClosest(target, bestTarget)) continue
      if (shouldPrioritizeFurthest(target, bestTarget)) continue

      bestTarget = target
    }

    return bestTarget?.coordinates
  }
}
