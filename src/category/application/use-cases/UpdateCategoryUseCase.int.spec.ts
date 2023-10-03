import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import { UUID } from '../../../@shared/domain/value-object/uuid';
import { setupSequelize } from '../../../@shared/infra/testing/helpers';
import { Category } from '../../domain/Category';
import { CategoryModel } from '../../infra/db/sequelize/CategoryModel';
import { CategorySequelizeRepository } from '../../infra/db/sequelize/CategorySequelizeRepository';
import { UpdateCategoryUseCase } from './UpdateCategoryUseCase';

describe('[UpdateCategoryUseCase] Integration Test', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  describe('execute', () => {
    it('should throws an error when entity not found', async () => {
      await expect(
        useCase.execute({ id: new UUID().id, name: 'Movie' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should update a category', async () => {
      const entity = Category.fake().aCategory().build();
      repository.insert(entity);
      await expect(
        useCase.execute({ id: entity.id.id, name: 'Movie' }),
      ).resolves.toStrictEqual({
        id: entity.id.id,
        name: 'Movie',
        description: entity.description,
        active: true,
        createdAt: entity.createdAt,
      });

      type Arrange = {
        readonly input: {
          readonly id: string;
          readonly name: string;
          readonly description?: string | null;
          readonly active?: boolean;
        };
        readonly expected: {
          readonly id: string;
          readonly name: string;
          readonly description: string | null;
          readonly active: boolean;
          readonly createdAt: Date;
        };
      };

      const arrange: Arrange[] = [
        {
          input: {
            id: entity.id.id,
            name: 'Movie',
            description: 'a work of visual art that simulates...',
          },
          expected: {
            id: entity.id.id,
            name: 'Movie',
            description: 'a work of visual art that simulates...',
            active: true,
            createdAt: entity.createdAt,
          },
        },
        {
          input: {
            id: entity.id.id,
            name: 'Soap Opera',
            description: 'a long-running radio or television serial...',
          },
          expected: {
            id: entity.id.id,
            name: 'Soap Opera',
            description: 'a long-running radio or television serial...',
            active: true,
            createdAt: entity.createdAt,
          },
        },
        {
          input: {
            id: entity.id.id,
            name: 'Serie',
            active: false,
          },
          expected: {
            id: entity.id.id,
            name: 'Serie',
            description: 'a long-running radio or television serial...',
            active: false,
            createdAt: entity.createdAt,
          },
        },
        {
          input: {
            id: entity.id.id,
            name: 'Documentary',
          },
          expected: {
            id: entity.id.id,
            name: 'Documentary',
            description: 'a long-running radio or television serial...',
            active: false,
            createdAt: entity.createdAt,
          },
        },
        {
          input: {
            id: entity.id.id,
            name: 'Novel',
            active: true,
          },
          expected: {
            id: entity.id.id,
            name: 'Novel',
            description: 'a long-running radio or television serial...',
            active: true,
            createdAt: entity.createdAt,
          },
        },
        {
          input: {
            id: entity.id.id,
            name: 'Cartoon',
            description: 'a type of visual art that is typically drawn...',
            active: false,
          },
          expected: {
            id: entity.id.id,
            name: 'Cartoon',
            description: 'a type of visual art that is typically drawn...',
            active: false,
            createdAt: entity.createdAt,
          },
        },
      ];

      for (const item of arrange) {
        const output = await useCase.execute({
          id: item.input.id,
          ...(item.input.name && { name: item.input.name }),
          ...('description' in item.input && {
            description: item.input.description,
          }),
          ...('active' in item.input && { active: item.input.active }),
        });
        const updated = await repository.findById(new UUID(item.input.id));
        expect(output).toStrictEqual({
          id: entity.id.id,
          name: item.expected.name,
          description: item.expected.description,
          active: item.expected.active,
          createdAt: item.expected.createdAt,
        });
        expect(updated.toJSON()).toStrictEqual({
          id: entity.id.id,
          name: item.expected.name,
          description: item.expected.description,
          active: item.expected.active,
          createdAt: updated.createdAt,
        });
      }
    });
  });
});
