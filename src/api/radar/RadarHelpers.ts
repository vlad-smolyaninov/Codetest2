import { Coordinates } from './RadarTypes'

export default class RadarHelpers {
  public static calculateDistance(point: Coordinates): number {
    return Math.sqrt(point.x ** 2 + point.y ** 2)
  }

  public static isCloserToOrigin(point1: Coordinates, point2: Coordinates): boolean {
    // Calculate the distance of each point from the origin using the Pythagorean theorem
    const distance1 = RadarHelpers.calculateDistance(point1)
    const distance2 = RadarHelpers.calculateDistance(point2)

    // Check which point is closer to the origin
    return distance1 < distance2
  }
}
