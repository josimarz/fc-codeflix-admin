import { Entity } from '../../../domain/Entity';
import { NotFoundError } from '../../../domain/error/NotFoundError';
import { UUID } from '../../../domain/value-object/uuid';
import { InMemoryRepository } from './InMemoryRepository';

type StubEntityProps = {
  readonly name: string;
  readonly price: number;
};

class StubEntity extends Entity {
  _id: UUID;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();
    this._id = new UUID();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON(): any {
    return {
      id: this._id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, UUID> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('[InMemoryRepository] Unit Test', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  describe('insert', () => {
    it('should insert a new entity', async () => {
      const props: StubEntityProps = {
        name: 'MacBook Pro 16 2021',
        price: 3778.99,
      };
      const entity = new StubEntity(props);
      await repository.insert(entity);
      expect(repository.items).toHaveLength(1);
      expect(repository.items[0]).toBe(entity);
    });
  });

  describe('bulkInsert', () => {
    it('should insert a bulk of entities', async () => {
      const entities: StubEntity[] = [
        new StubEntity({
          name: 'Headphone',
          price: 299.9,
        }),
        new StubEntity({
          name: 'Magic Mouse',
          price: 349,
        }),
      ];
      await repository.bulkInsert(entities);
      expect(repository.items).toHaveLength(2);
      expect(repository.items).toEqual(expect.arrayContaining(entities));
    });
  });

  describe('update', () => {
    const entity = new StubEntity({
      name: 'Mousepad',
      price: 48.8,
    });

    it('should update an entity', async () => {
      repository.items.push(entity);
      entity.price = 52;
      await expect(repository.update(entity)).resolves.not.toThrow();
      expect(repository.items[0]).toBe(entity);
    });

    it('should throws an error due to entity not found', async () => {
      entity._id = new UUID();
      await expect(repository.update(entity)).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    const entity = new StubEntity({
      name: 'iPhone 15 Pro',
      price: 9999.99,
    });

    it('should delete an entity', async () => {
      repository.items.push(entity);
      await expect(repository.delete(entity._id)).resolves.not.toThrow();
      expect(repository.items).toHaveLength(0);
    });

    it('should throws an error due to entity not found', async () => {
      await expect(repository.delete(entity._id)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('findById', () => {
    const entity = new StubEntity({
      name: 'Table Tennis',
      price: 699.8,
    });

    it('should return an entity with the given id', async () => {
      repository.items.push(entity);
      await expect(repository.findById(entity._id)).resolves.toBe(entity);
    });

    it('should throws an error due entity not found', async () => {
      await expect(repository.findById(entity._id)).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('findAll', () => {
    it('should return all entities from memory', async () => {
      const entities: StubEntity[] = [
        new StubEntity({
          name: 'T-Shirt',
          price: 29.9,
        }),
        new StubEntity({
          name: 'Ford Mustange 1974',
          price: 89999.0,
        }),
      ];
      repository.items.push(...entities);
      await expect(repository.findAll()).resolves.toEqual(
        expect.arrayContaining(entities),
      );
    });
  });
});
