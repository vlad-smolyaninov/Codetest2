export enum Protocol {
  closestEnemies = 'closest-enemies', //The closest point where enemies are present should be prioritised.
  furthestEnemies = 'furthest-enemies', //Priority should be given to the furthest point where enemies are present.
  assistAllies = 'assist-allies', //Priority should be given to points where there are allies.
  avoidCrossfire = 'avoid-crossfire', //No point where there is an ally should be attacked.
  prioritizeMech = 'prioritize-mech', //A mech should be attacked if found. If not, any other type of target is valid.
  avoidMech = 'avoid-mech', //No mech-type enemy should be attacked.
}

export enum Enemy {
  soldier = 'soldier',
  mech = 'mech',
}

export type Coordinates = {
  x: number
  y: number
}

export interface IScan {
  coordinates: Coordinates
  enemies: { type: Enemy; number: number }
  allies?: number
}

export interface IRadar {
  protocols: Protocol[]
  scan: IScan[]
}
