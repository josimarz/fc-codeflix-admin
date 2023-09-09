import { ValueObject } from './ValueObject';

export abstract class Entity {
  abstract get _id(): ValueObject;
  abstract toJSON(): any;
}
