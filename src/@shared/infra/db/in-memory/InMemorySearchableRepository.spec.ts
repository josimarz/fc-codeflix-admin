import { Entity } from '../../../domain/Entity';
import { SearchParams } from '../../../domain/repository/SearchParams';
import { SearchResult } from '../../../domain/repository/SearchResult';
import { UUID } from '../../../domain/value-object/uuid';
import { InMemorySearchableRepository } from './InMemorySearchableRepository';

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

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
  StubEntity,
  UUID
> {
  protected async applyFilter(
    items: StubEntity[],
    filter: string,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('[InMemorySearchableRepository] Unit Test', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
  });

  describe('applyFilter', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity('Epaminondas')];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      const filtered = await repository['applyFilter'](items, null);
      expect(filtered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should applu filter param', async () => {
      const items = [
        new StubEntity('Epaminondas'),
        new StubEntity('Maria'),
        new StubEntity('Mariana'),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter');

      let filtered = await repository['applyFilter'](items, 'mari');
      expect(filtered).toStrictEqual([items[1], items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      filtered = await repository['applyFilter'](items, 'EPA');
      expect(filtered).toStrictEqual([items[0]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      filtered = await repository['applyFilter'](items, 'nothing');
      expect(filtered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort', () => {
    const items = [
      new StubEntity('Eustáquio'),
      new StubEntity('Morgana'),
      new StubEntity('Astrogildo'),
    ];

    it('should no sort items', () => {
      const sorted = repository['applySort'](items, null, null);
      expect(sorted).toStrictEqual(items);
    });

    it('should sort items', () => {
      let sorted = repository['applySort'](items, 'name', 'desc');
      expect(sorted).toStrictEqual([items[1], items[0], items[2]]);

      sorted = repository['applySort'](items, 'name', 'asc');
      expect(sorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPagination', () => {
    const items = [
      new StubEntity('Ziraldo'),
      new StubEntity('Sebastião'),
      new StubEntity('Marina'),
      new StubEntity('Sabrina'),
      new StubEntity('Jorel'),
      new StubEntity('Armando'),
      new StubEntity('Joana'),
      new StubEntity('Elisa'),
      new StubEntity('Clara'),
      new StubEntity('Marcondes'),
      new StubEntity('Clarice'),
    ];
    it('should paginate items', () => {
      let paginated = repository['applyPagination'](items, 1, 2);
      expect(paginated).toStrictEqual([items[0], items[1]]);

      paginated = repository['applyPagination'](items, 2, 2);
      expect(paginated).toStrictEqual([items[2], items[3]]);

      paginated = repository['applyPagination'](items, 3, 2);
      expect(paginated).toStrictEqual([items[4], items[5]]);

      paginated = repository['applyPagination'](items, 3, 5);
      expect(paginated).toStrictEqual([items[10]]);

      paginated = repository['applyPagination'](items, 4, 5);
      expect(paginated).toHaveLength(0);
    });
  });

  describe('search', () => {
    const items = [
      new StubEntity('Ziraldo'),
      new StubEntity('Sebastião'),
      new StubEntity('Marina'),
      new StubEntity('Sabrina'),
      new StubEntity('Jorel'),
      new StubEntity('Armando'),
      new StubEntity('Joana'),
      new StubEntity('Elisa'),
      new StubEntity('Clara'),
      new StubEntity('Marcondes'),
      new StubEntity('Clarice'),
    ];
    it('should apply only pagination', async () => {
      repository.items = items;
      const result = await repository.search(
        new SearchParams({
          perPage: 5,
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: items.slice(0, 5),
          total: 11,
          currentPage: 1,
          perPage: 5,
        }),
      );
    });

    it('should apply pagination and filter', async () => {
      repository.items = items;
      let result = await repository.search(
        new SearchParams({
          page: 1,
          perPage: 5,
          filter: 'jo',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[4], items[6]],
          total: 2,
          currentPage: 1,
          perPage: 5,
        }),
      );

      result = await repository.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          filter: 'l',
        }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[10]],
          total: 5,
          currentPage: 3,
          perPage: 2,
        }),
      );
    });

    it('should apply pagination and sort', async () => {
      repository.items = items;
      const cases: { params: SearchParams; result: SearchResult }[] = [
        {
          params: new SearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
          }),
          result: new SearchResult({
            items: [items[5], items[8]],
            total: 11,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
          }),
          result: new SearchResult({
            items: [items[10], items[7]],
            total: 11,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          result: new SearchResult({
            items: [items[0], items[1]],
            total: 11,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          result: new SearchResult({
            items: [items[3], items[2]],
            total: 11,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      for (const c of cases) {
        await expect(repository.search(c.params)).resolves.toStrictEqual(
          c.result,
        );
      }
    });

    it('should search, sort an paginate', async () => {
      repository.items = items;
      const cases: { params: SearchParams; result: SearchResult }[] = [
        {
          params: new SearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'jo',
          }),
          result: new SearchResult({
            items: [items[6], items[4]],
            total: 2,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 3,
            perPage: 2,
            sort: 'name',
            filter: 'n',
          }),
          result: new SearchResult({
            items: [items[3]],
            total: 5,
            currentPage: 3,
            perPage: 2,
          }),
        },
      ];

      for (const c of cases) {
        await expect(repository.search(c.params)).resolves.toStrictEqual(
          c.result,
        );
      }
    });
  });
});
