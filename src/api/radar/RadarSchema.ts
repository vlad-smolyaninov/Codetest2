import { JSONSchemaType } from 'ajv'
import { Enemy, IRadar, IScan, Protocol } from './RadarTypes'

export const scanSchema: JSONSchemaType<IScan> = {
  type: 'object',
  properties: {
    coordinates: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
      },
      required: ['x', 'y'],
    },
    enemies: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: Object.values(Enemy) },
        number: { type: 'number' },
      },
      required: ['type', 'number'],
    },
    allies: { type: 'number', nullable: true },
  },
  required: ['coordinates', 'enemies'],
}

export const radarSchema: JSONSchemaType<IRadar> = {
  type: 'object',
  properties: {
    protocols: { type: 'array', uniqueItems: true, items: { type: 'string', enum: Object.values(Protocol) } },
    scan: {
      type: 'array',
      items: scanSchema,
    },
  },
  required: ['protocols', 'scan'],
  additionalProperties: false,
}
