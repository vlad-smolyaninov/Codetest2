import { Coordinates, Enemy, IRadar, Protocol } from '../../../src/api/radar/RadarTypes'
import RadarTargetCalculator from '../../../src/api/radar/RadarTargetCalculator'
import { MAX_DISTANCE } from '../../../src/api/radar/RadarConstants'

describe('RadarTargetCalculator', () => {
  describe('calculateDistance', () => {
    it('should return the correct distance from the origin', () => {
      const point: Coordinates = { x: 3, y: 4 }
      const expectedDistance = 5

      expect(RadarTargetCalculator.calculateDistance(point)).toEqual(expectedDistance)
    })
  })

  describe('isCloserToOrigin', () => {
    it('should return true if point1 is closer to the origin', () => {
      const point1: Coordinates = { x: 3, y: 4 }
      const point2: Coordinates = { x: 5, y: 3 }

      expect(RadarTargetCalculator.isCloserToOrigin(point1, point2)).toBe(true)
    })

    it('should return false if point2 is closer to the origin', () => {
      const point1: Coordinates = { x: 5, y: 3 }
      const point2: Coordinates = { x: 3, y: 4 }

      expect(RadarTargetCalculator.isCloserToOrigin(point1, point2)).toBe(false)
    })
  })

  describe('calculateTarget', () => {
    const scanMock = [
      {
        allies: 2,
        enemies: { type: Enemy.soldier, number: 1 },
        coordinates: { x: 5, y: 5 },
      },
      {
        enemies: { type: Enemy.mech, number: 1 },
        coordinates: { x: 3, y: 3 },
      },
      {
        enemies: { type: Enemy.soldier, number: 1 },
        coordinates: { x: 1, y: 1 },
      },
    ]

    const radar = new RadarTargetCalculator()

    it('returns the coordinates of closest target', () => {
      const target = radar.calculateTarget({
        protocols: [Protocol.closestEnemies],
        scan: scanMock,
      })
      expect(target).toEqual({ x: 1, y: 1 })
    })

    it('returns the coordinates of furthest target', () => {
      const target = radar.calculateTarget({
        protocols: [Protocol.furthestEnemies],
        scan: scanMock,
      })
      expect(target).toEqual({ x: 5, y: 5 })
    })

    it('skips targets that are out of range', () => {
      const data: IRadar = {
        protocols: [Protocol.furthestEnemies],
        scan: [
          ...scanMock,
          {
            allies: 2,
            enemies: { type: Enemy.soldier, number: 1 },
            coordinates: { x: MAX_DISTANCE, y: MAX_DISTANCE / 2 },
          },
        ],
      }
      const target = radar.calculateTarget(data)
      expect(target).toEqual({ x: 5, y: 5 })
    })

    it('skips targets that should be avoided', () => {
      const data: IRadar = {
        protocols: [Protocol.avoidMech, Protocol.avoidCrossfire, Protocol.furthestEnemies],
        scan: scanMock,
      }
      const target = radar.calculateTarget(data)
      expect(target).toEqual({ x: 1, y: 1 })
    })

    it('prioritizes targets that should be prioritized', () => {
      const data: IRadar = {
        protocols: [Protocol.prioritizeMech, Protocol.assistAllies, Protocol.furthestEnemies],
        scan: [
          {
            allies: 1,
            enemies: { type: Enemy.soldier, number: 1 },
            coordinates: { x: 0, y: 1 },
          },
          ...scanMock,
          {
            allies: 3,
            enemies: { type: Enemy.mech, number: 1 },
            coordinates: { x: 2, y: 2 },
          },
        ],
      }
      const target = radar.calculateTarget(data)
      expect(target).toEqual({ x: 2, y: 2 })
    })
  })
})
