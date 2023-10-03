import { Entity } from '../Entity';

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityClass: new (...args: any[]) => Entity) {
    const idStr = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} not found for id ${idStr}`);
    this.name = this.constructor.name;
  }
}
