import { randomUUID } from 'crypto';
import { UUID } from '../../../../@shared/domain/value-object/uuid';
import { Category } from '../../../domain/Category';
import { CategoryOutputMapper } from './CategoryOutput';

describe('[CategoryOutputMapper] Unit Test', () => {
  describe('toOutput', () => {
    it('should map a category to a output object', () => {
      const id = randomUUID();
      const name = 'Movie';
      const description = 'a work of visual art that simulates experiences...';
      const active = false;
      const createdAt = new Date();
      const category = new Category({
        id: new UUID(id),
        name,
        description,
        active,
        createdAt,
      });
      expect(CategoryOutputMapper.toOutput(category)).toStrictEqual({
        id,
        name,
        description,
        active,
        createdAt,
      });
    });
  });
});
