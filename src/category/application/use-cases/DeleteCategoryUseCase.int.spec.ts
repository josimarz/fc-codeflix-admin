import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import {
  InvalidUUIDError,
  UUID,
} from '../../../@shared/domain/value-object/uuid';
import { setupSequelize } from '../../../@shared/infra/testing/helpers';
import { Category } from '../../domain/Category';
import { CategoryModel } from '../../infra/db/sequelize/CategoryModel';
import { CategorySequelizeRepository } from '../../infra/db/sequelize/CategorySequelizeRepository';
import { DeleteCategoryUseCase } from './DeleteCategoryUseCase';

describe('[DeleteCategoryUseCase] Unit Test', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  describe('execute', () => {
    it('should throws an error when given id is invalid', async () => {
      await expect(useCase.execute({ id: '0000' })).rejects.toThrow(
        InvalidUUIDError,
      );
    });

    it('should throws an error when entity not found', async () => {
      await expect(useCase.execute({ id: new UUID().id })).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should delete a category', async () => {
      const category = Category.fake().aCategory().build();
      await repository.insert(category);
      const spyDelete = jest.spyOn(repository, 'delete');
      await expect(
        useCase.execute({ id: category.id.id }),
      ).resolves.not.toThrow();
      await expect(repository.findById(category.id)).resolves.toBeNull();
      expect(spyDelete).toHaveBeenCalledTimes(1);
    });
  });
});
