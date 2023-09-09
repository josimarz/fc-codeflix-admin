export type FieldsErrors = {
  [field: string]: string[];
};

export interface ValidatorFields<T> {
  errors: FieldsErrors | null;
  validatedData: T | null;
  validate(data: any): boolean;
}
