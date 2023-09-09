import { FieldsErrors } from './@shared/domain/validator/ValidatorFields';

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessage: (actual: FieldsErrors) => R;
    }
  }
}
