import { randomUUID } from 'crypto';
import { EntityValidationError } from '../../../../@shared/domain/validator/EntityValidationError';
import { UUID } from '../../../../@shared/domain/value-object/uuid';
import { setupSequelize } from '../../../../@shared/infra/testing/helpers';
import { Category } from '../../../domain/Category';
import { CategoryModel } from './CategoryModel';
import { CategoryModelMapper } from './CategoryModelMapper';

describe('[CategoryModelMapper] Integration Test', () => {
  setupSequelize({ models: [CategoryModel] });

  describe('toEntity', () => {
    it('should throws an error when category is invalid', () => {
      const model = CategoryModel.build({
        id: randomUUID(),
      });
      try {
        CategoryModelMapper.toEntity(model);
      } catch (error) {
        expect(error).toBeInstanceOf(EntityValidationError);
        expect(error as EntityValidationError).toMatchObject({
          name: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
          ],
        });
      }
    });

    it('should convert the given model to a valid entity', () => {
      const id = randomUUID();
      const name = 'Movie';
      const description = 'Visual art that simulates experiences and...';
      const active = true;
      const createdAt = new Date();
      const model = CategoryModel.build({
        id,
        name,
        description,
        active,
        createdAt,
      });
      const entity = CategoryModelMapper.toEntity(model);
      const category = new Category({
        id: new UUID(id),
        name,
        description,
        active,
        createdAt,
      });
      expect(entity.toJSON()).toStrictEqual(category.toJSON());
    });
  });

  describe('toModel', () => {
    it('should convert the given entity to a model', () => {
      const id = randomUUID();
      const name = 'Movie';
      const description = 'Visual art that simulates experiences and...';
      const active = true;
      const createdAt = new Date();
      const entity = new Category({
        id: new UUID(id),
        name,
        description,
        active,
        createdAt,
      });
      const model = CategoryModelMapper.toModel(entity);
      expect(model.toJSON()).toStrictEqual(entity.toJSON());
    });
  });
});
