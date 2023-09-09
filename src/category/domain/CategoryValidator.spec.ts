import { FieldsErrors } from '../../@shared/domain/validator/ValidatorFields';
import { Category, CategoryCreateCommand } from './Category';

type Case = {
  readonly props: CategoryCreateCommand;
  readonly errors: FieldsErrors;
};

describe('[CategoryValidator] Unit Test', () => {
  describe('validate', () => {
    it('should validate category entity', () => {
      const cases: Case[] = [
        {
          props: {
            name: null,
          },
          errors: {
            name: [
              'name should not be empty',
              'name should be a string',
              'name must be shorter than or equal to 255 characters',
            ],
          },
        },
        {
          props: {
            name: undefined,
          },
          errors: {
            name: [
              'name should not be empty',
              'name should be a string',
              'name must be shorter than or equal to 255 characters',
            ],
          },
        },
        {
          props: {
            name: 'j'.repeat(256),
          },
          errors: {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        },
        {
          props: {
            name: 'Movie',
            description: 7 as any,
          },
          errors: {
            description: ['description should be a string'],
          },
        },
        {
          props: {
            name: 'Movie',
            active: '' as any,
          },
          errors: {
            description: ['active should be a boolean'],
          },
        },
      ];

      for (const item of cases) {
        expect(() => Category.create(item.props)).containsErrorMessage(
          item.errors,
        );
      }
    });
  });
});
