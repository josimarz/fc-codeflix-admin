import { FieldsErrors } from './ValidatorFields';

export class EntityValidationError extends Error {
  constructor(
    public errors: FieldsErrors,
    message?: string,
  ) {
    super(message ?? 'Validation error');
    this.name = this.constructor.name;
  }

  count(): number {
    return Object.keys(this.errors).length;
  }
}
