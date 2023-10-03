import { Entity } from '../../../domain/Entity';
import { ValueObject } from '../../../domain/ValueObject';
import { NotFoundError } from '../../../domain/error/NotFoundError';
import { Repository } from '../../../domain/repository/Repository';

export abstract class InMemoryRepository<
  T extends Entity,
  U extends ValueObject,
> implements Repository<T, U>
{
  public items: T[];

  constructor() {
    this.items = [];
  }

  async insert(entity: T): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: T[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: T): Promise<void> {
    const i = this.items.findIndex((item) => item._id.equals(entity._id));
    if (i == -1) {
      throw new NotFoundError(entity._id, this.getEntity());
    }
    this.items[i] = entity;
  }

  async delete(id: U): Promise<void> {
    const i = this.items.findIndex((item) => item._id.equals(id));
    if (i == -1) {
      throw new NotFoundError(id, this.getEntity());
    }
    this.items.splice(i, 1);
  }

  async findById(id: U): Promise<T> {
    const item = this.items.find((item) => item._id.equals(id));
    if (!item) {
      throw new NotFoundError(id, this.getEntity());
    }
    return item;
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => T;
}
