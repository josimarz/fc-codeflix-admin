import { UUID } from '../../../@shared/domain/value-object/uuid';
import { setupSequelize } from '../../../@shared/infra/testing/helpers';
import { CategoryModel } from '../../infra/db/sequelize/CategoryModel';
import { CategorySequelizeRepository } from '../../infra/db/sequelize/CategorySequelizeRepository';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

describe('[CreateCategoryUseCase] Integration Test', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  describe('execute', () => {
    let name = 'Movie';
    const description = 'A long-running radio or television serial...';

    it('should create a category with given name', async () => {
      const output = await useCase.execute({ name });
      const entity = await repository.findById(new UUID(output.id));
      expect(output).toStrictEqual({
        id: entity.id.id,
        name,
        description: null,
        active: true,
        createdAt: entity.createdAt,
      });
    });

    it('should create a category with given name and description', async () => {
      name = 'Soap Opera';
      const output = await useCase.execute({ name, description });
      const entity = await repository.findById(new UUID(output.id));
      expect(output).toStrictEqual({
        id: entity.id.id,
        name,
        description,
        active: true,
        createdAt: entity.createdAt,
      });
    });

    it('should create a active category with given name and description', async () => {
      const output = await useCase.execute({
        name,
        description,
        active: true,
      });
      const entity = await repository.findById(new UUID(output.id));
      expect(output).toStrictEqual({
        id: entity.id.id,
        name,
        description,
        active: true,
        createdAt: entity.createdAt,
      });
    });

    it('should create a inactive category with given name and description', async () => {
      const output = await useCase.execute({
        name,
        description,
        active: false,
      });
      const entity = await repository.findById(new UUID(output.id));
      expect(output).toStrictEqual({
        id: entity.id.id,
        name,
        description,
        active: false,
        createdAt: entity.createdAt,
      });
    });
  });
});
