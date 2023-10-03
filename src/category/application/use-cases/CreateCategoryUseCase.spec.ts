import { CategoryInMemoryRepository } from '../../infra/db/in-memory/CategoryInMemoryRepository';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

describe('[CreateCategoryUseCase] Unit Test', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  describe('execute', () => {
    const name = 'Movie';
    const description = 'A long-running radio or television serial...';

    it('should create a active category with given name', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      await expect(useCase.execute({ name })).resolves.toStrictEqual({
        id: repository.items[0].id.id,
        name,
        description: null,
        active: true,
        createdAt: repository.items[0].createdAt,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
    });

    it('should create a inactive category with given name and description', async () => {
      const spyInsert = jest.spyOn(repository, 'insert');
      await expect(
        useCase.execute({ name, description, active: false }),
      ).resolves.toStrictEqual({
        id: repository.items[0].id.id,
        name,
        description,
        active: false,
        createdAt: repository.items[0].createdAt,
      });
      expect(spyInsert).toHaveBeenCalledTimes(1);
    });
  });
});
