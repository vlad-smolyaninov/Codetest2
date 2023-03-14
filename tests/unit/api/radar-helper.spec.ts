import { Coordinates } from '../../../src/api/radar/RadarTypes'
import RadarHelpers from '../../../src/api/radar/RadarHelpers'

describe('RadarHelpers', () => {
  describe('calculateDistance', () => {
    it('should return the correct distance from the origin', () => {
      const point: Coordinates = { x: 3, y: 4 }
      const expectedDistance = 5

      expect(RadarHelpers.calculateDistance(point)).toEqual(expectedDistance)
    })
  })

  describe('isCloserToOrigin', () => {
    it('should return true if point1 is closer to the origin', () => {
      const point1: Coordinates = { x: 3, y: 4 }
      const point2: Coordinates = { x: 5, y: 3 }

      expect(RadarHelpers.isCloserToOrigin(point1, point2)).toBe(true)
    })

    it('should return false if point2 is closer to the origin', () => {
      const point1: Coordinates = { x: 5, y: 3 }
      const point2: Coordinates = { x: 3, y: 4 }

      expect(RadarHelpers.isCloserToOrigin(point1, point2)).toBe(false)
    })
  })
})
