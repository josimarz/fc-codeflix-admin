import { NotFoundError } from '../../../../@shared/domain/error/NotFoundError';
import { UUID } from '../../../../@shared/domain/value-object/uuid';
import { setupSequelize } from '../../../../@shared/infra/testing/helpers';
import { Category } from '../../../../category/domain/Category';
import {
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/CategoryRepository';
import { CategoryModel } from './CategoryModel';
import { CategoryModelMapper } from './CategoryModelMapper';
import { CategorySequelizeRepository } from './CategorySequelizeRepository';

describe('[CategorySequelizeRepository] Integration Test', () => {
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  describe('search', () => {
    it('should paginate results', async () => {
      const name = 'Movie';
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName(name)
        .withDescription(null)
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(CategoryModelMapper, 'toEntity');
      const result = await repository.search(new CategorySearchParams());
      expect(result).toBeInstanceOf(CategorySearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(result.toJSON()).toMatchObject({
        total: 16,
        currentPage: 1,
        lastPage: 2,
        perPage: 15,
      });
      result.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
      });
      const items = result.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          description: null,
          active: true,
          createdAt,
        }),
      );
    });

    it('should order by createdAt DESC', async () => {
      const createdAt = new Date();
      const categories = Category.fake()
        .theCategories(16)
        .withName((index) => `Movie ${index}`)
        .withDescription(null)
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build();
      const result = await repository.search(new CategorySearchParams());
      [...result.items]
        .reverse()
        .forEach((item, i) =>
          expect(`Movie ${i}`).toBe(`${categories[i + 1].name}`),
        );
    });

    it('should apply pagination and filter', async () => {
      const categories = [
        Category.fake()
          .aCategory()
          .withName('Movie')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('Soap Opera')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('Classic Movie')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        Category.fake()
          .aCategory()
          .withName('Live Action Movie')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];
      await repository.bulkInsert(categories);
      let result = await repository.search(
        new CategorySearchParams({
          page: 1,
          perPage: 2,
          filter: 'Movie',
        }),
      );
      expect(result.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[0], categories[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
        }).toJSON(true),
      );

      result = await repository.search(
        new CategorySearchParams({
          page: 2,
          perPage: 2,
          filter: 'movie',
        }),
      );
      expect(result.toJSON(true)).toMatchObject(
        new CategorySearchResult({
          items: [categories[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
        }).toJSON(true),
      );
    });

    it('should apply pagination and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'createdAt']);

      const categories = [
        Category.fake().aCategory().withName('Movie').build(), // 0
        Category.fake().aCategory().withName('Novel').build(), // 1
        Category.fake().aCategory().withName('Soap Opera').build(), // 2
        Category.fake().aCategory().withName('Documentary').build(), // 3
        Category.fake().aCategory().withName('Serie').build(), // 4
      ];
      await repository.bulkInsert(categories);

      const arrange: {
        params: CategorySearchParams;
        result: CategorySearchResult;
      }[] = [
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[3], categories[0]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[4]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[2], categories[4]],
            total: 5,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            sortDir: 'desc',
          }),
          result: new CategorySearchResult({
            items: [categories[1], categories[0]],
            total: 5,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      for (const item of arrange) {
        const result = await repository.search(item.params);
        expect(result.toJSON(true)).toMatchObject(item.result.toJSON(true));
      }
    });

    it('should search using filter, sort and pagination', async () => {
      const categories = [
        Category.fake().aCategory().withName('Movie').build(), // 0
        Category.fake().aCategory().withName('Soap Opera').build(), // 1
        Category.fake().aCategory().withName('Classic Movie').build(), // 2
        Category.fake().aCategory().withName('Serie').build(), // 3
        Category.fake().aCategory().withName('Cartoon Movie').build(), // 4
      ];
      await repository.bulkInsert(categories);
      const arrange: {
        params: CategorySearchParams;
        result: CategorySearchResult;
      }[] = [
        {
          params: new CategorySearchParams({
            page: 1,
            perPage: 2,
            sort: 'name',
            filter: 'Movie',
          }),
          result: new CategorySearchResult({
            items: [categories[4], categories[2]],
            total: 3,
            currentPage: 1,
            perPage: 2,
          }),
        },
        {
          params: new CategorySearchParams({
            page: 2,
            perPage: 2,
            sort: 'name',
            filter: 'Movie',
          }),
          result: new CategorySearchResult({
            items: [categories[0]],
            total: 3,
            currentPage: 2,
            perPage: 2,
          }),
        },
      ];

      for (const item of arrange) {
        const result = await repository.search(item.params);
        expect(result.toJSON(true)).toMatchObject(result.toJSON(true));
      }
    });
  });

  describe('insert', () => {
    it('should insert a new category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      const model = await CategoryModel.findByPk(category.id.id);
      expect(model.toJSON()).toStrictEqual(category.toJSON());
    });
  });

  describe('findById', () => {
    it('should find a category by given id', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      const found = await repository.findById(category.id);
      expect(category.toJSON()).toStrictEqual(found.toJSON());
    });

    it('should return null due to category not found', async () => {
      await expect(repository.findById(new UUID())).resolves.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const category = new Category({ name: 'Movies' });
      await repository.insert(category);
      const categories = await repository.findAll();
      expect(categories).toHaveLength(1);
      expect(categories[0].toJSON()).toStrictEqual(category.toJSON());
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      category.changeName('Soap Opera');
      await repository.update(category);
      const found = await repository.findById(category.id);
      expect(found.toJSON()).toStrictEqual(category.toJSON());
    });

    it('should throw an error when category not found', async () => {
      const category = Category.fake().aCategory().build();
      await expect(repository.update(category)).rejects.toThrowError(
        NotFoundError,
      );
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      await expect(repository.delete(category.id)).resolves.not.toThrow();
    });

    it('should throw an error when category not found', async () => {
      await expect(repository.delete(new UUID())).rejects.toThrowError(
        NotFoundError,
      );
    });
  });
});
