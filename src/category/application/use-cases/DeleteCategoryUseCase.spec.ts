import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import {
  InvalidUUIDError,
  UUID,
} from '../../../@shared/domain/value-object/uuid';
import { Category } from '../../domain/Category';
import { CategoryInMemoryRepository } from '../../infra/db/in-memory/CategoryInMemoryRepository';
import { DeleteCategoryUseCase } from './DeleteCategoryUseCase';

describe('[DeleteCategoryUseCase] Unit Test', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
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
      expect(spyDelete).toHaveBeenCalledTimes(1);
      expect(repository.items).toHaveLength(0);
    });
  });
});
