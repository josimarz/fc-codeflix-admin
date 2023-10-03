import { ValueObject } from './ValueObject';
import { Notification } from './validator/Notification';

export abstract class Entity {
  protected notification: Notification;

  constructor() {
    this.notification = new Notification();
  }

  abstract get _id(): ValueObject;
  abstract toJSON(): any;
}
