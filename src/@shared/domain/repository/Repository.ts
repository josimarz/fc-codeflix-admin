import { Entity } from '../Entity';
import { ValueObject } from '../ValueObject';
import { SearchParams } from './SearchParams';
import { SearchResult } from './SearchResult';

export interface Repository<T extends Entity, U extends ValueObject> {
  insert(entity: T): Promise<void>;
  bulkInsert(entities: T[]): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: U): Promise<void>;
  findById(id: U): Promise<T>;
  findAll(): Promise<T[]>;
  getEntity(): new (...args: any[]) => T;
}

export interface SearchableRepository<
  T extends Entity,
  U extends ValueObject,
  F = string,
  I = SearchParams<F>,
  O = SearchResult,
> extends Repository<T, U> {
  sortableFields: string[];
  search(props: I): Promise<O>;
}
