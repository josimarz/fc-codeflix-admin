import { Entity } from '../Entity';
import { UUID } from '../value-object/uuid';
import { SearchResult, SearchResultProps } from './SearchResult';

class StubEntity extends Entity {
  _id: UUID;
  name: string;

  constructor(name: string) {
    super();
    this._id = new UUID();
    this.name = name;
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
    };
  }
}

describe('[SearchResult] Unit Test', () => {
  const entity1 = new StubEntity('Epaminondas');
  const entity2 = new StubEntity('Maria');
  describe('toJSON', () => {
    it('should set lastPage = 1 when perPage is greater than total', () => {
      const props: SearchResultProps<StubEntity> = {
        items: [entity1, entity2],
        total: 2,
        currentPage: 1,
        perPage: 10,
      };
      const result = new SearchResult(props);
      expect(result.toJSON()).toStrictEqual({
        items: [entity1, entity2],
        total: 2,
        currentPage: 1,
        perPage: 10,
        lastPage: 1,
      });
    });
    it('should truncate lastPage when total is not a multiple of perPage', () => {
      const props: SearchResultProps<StubEntity> = {
        items: [entity1, entity2],
        total: 101,
        currentPage: 1,
        perPage: 20,
      };
      const result = new SearchResult(props);
      expect(result.lastPage).toBe(6);
    });
  });
});
