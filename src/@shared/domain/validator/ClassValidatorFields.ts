import { validateSync } from 'class-validator';
import { FieldsErrors, ValidatorFields } from './ValidatorFields';

export abstract class ClassValidatorFields<T> implements ValidatorFields<T> {
  errors: FieldsErrors;
  validatedData: T;
  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
      return true;
    }
    this.validatedData = data;
    return false;
  }
}
