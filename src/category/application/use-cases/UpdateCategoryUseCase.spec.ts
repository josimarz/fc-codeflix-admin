import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import {
  InvalidUUIDError,
  UUID,
} from '../../../@shared/domain/value-object/uuid';
import { Category } from '../../domain/Category';
import { CategoryInMemoryRepository } from '../../infra/db/in-memory/CategoryInMemoryRepository';
import { UpdateCategoryUseCase } from './UpdateCategoryUseCase';

describe('[UpdateCategoryUseCase] Unit Test', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  describe('execute', () => {
    it('should throws an InvalidUUIDError due to given invalid UUID', async () => {
      await expect(
        useCase.execute({ id: '0000', name: 'Movie' }),
      ).rejects.toThrow(InvalidUUIDError);
    });

    it('should throws a not found erro due to not found id', async () => {
      await expect(
        useCase.execute({ id: new UUID().id, name: 'Movie' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should update a category', async () => {
      const spyUpdate = jest.spyOn(repository, 'update');
      const name = 'Movie';
      const entity = new Category({ name: 'Soap Opera' });
      repository.items = [entity];
      await expect(
        useCase.execute({ id: entity.id.id, name }),
      ).resolves.toStrictEqual({
        id: entity.id.id,
        name,
        description: null,
        active: true,
        createdAt: entity.createdAt,
      });
      expect(spyUpdate).toHaveBeenCalledTimes(1);

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
        await expect(
          useCase.execute({
            id: item.input.id,
            ...('name' in item.input && { name: item.input.name }),
            ...('description' in item.input && {
              description: item.input.description,
            }),
            ...('active' in item.input && { active: item.input.active }),
          }),
        ).resolves.toStrictEqual({
          id: entity.id.id,
          name: item.expected.name,
          description: item.expected.description,
          active: item.expected.active,
          createdAt: item.expected.createdAt,
        });
      }
    });
  });
});
