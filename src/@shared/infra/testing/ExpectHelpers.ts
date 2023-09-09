import { ClassValidatorFields } from '../../../@shared/domain/validator/ClassValidatorFields';
import { EntityValidationError } from '../../../@shared/domain/validator/EntityValidationError';
import { FieldsErrors } from '../../domain/validator/ValidatorFields';

type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessage(
    received: Expected,
    actual: FieldsErrors,
  ): jest.CustomMatcherResult {
    if (typeof received === 'function') {
      try {
        received();
        return { pass: true, message: () => '' };
      } catch (e) {
        if (e instanceof EntityValidationError) {
          return assertContainsErrorsMessages(e.errors, actual);
        }
      }
    } else {
      const { validator, data } = received;
      const valid = validator.validate(data);
      if (valid) {
        return { pass: true, message: () => '' };
      }
      return assertContainsErrorsMessages(validator.errors, actual);
    }
  },
});

function assertContainsErrorsMessages(
  expected: FieldsErrors,
  received: FieldsErrors,
): jest.CustomMatcherResult {
  const matches = expect.objectContaining(received).asynmmetricMatch(expected);
  if (matches) {
    return { pass: true, message: () => '' };
  }
  return {
    pass: false,
    message: () =>
      `The validation errors not contains ${JSON.stringify(
        received,
      )}. Current: ${JSON.stringify(expected)}`,
  };
}
