import { randomUUID } from 'crypto';
import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import { InvalidUUIDError } from '../../../@shared/domain/value-object/uuid';
import { setupSequelize } from '../../../@shared/infra/testing/helpers';
import { Category } from '../../domain/Category';
import { CategoryModel } from '../../infra/db/sequelize/CategoryModel';
import { CategorySequelizeRepository } from '../../infra/db/sequelize/CategorySequelizeRepository';
import { GetCategoryUseCase } from './GetCategoryUseCase';

describe('[GetCategoryUseCase] Unit Test', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  describe('execute', () => {
    it('should throws an error due to invalid given UUID', async () => {
      await expect(useCase.execute({ id: '0000' })).rejects.toThrow(
        InvalidUUIDError,
      );
    });

    it('should throws an error due to entity not found', async () => {
      await expect(useCase.execute({ id: randomUUID() })).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should get a category with given UUID', async () => {
      const category = Category.fake().aCategory().build();
      const spyFindById = jest.spyOn(repository, 'findById');
      await repository.insert(category);
      await expect(
        useCase.execute({ id: category.id.id }),
      ).resolves.toStrictEqual(category.toJSON());
      expect(spyFindById).toHaveBeenCalledTimes(1);
    });
  });
});
