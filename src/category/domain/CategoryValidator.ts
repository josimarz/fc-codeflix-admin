import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '../../@shared/domain/validator/ClassValidatorFields';
import { Category } from './Category';

class Rules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;

  constructor({ name, description, active }: Category) {
    Object.assign(this, { name, description, active });
  }
}

export class CategoryValidator extends ClassValidatorFields<Rules> {
  validate(category: Category): boolean {
    return super.validate(new Rules(category));
  }
}

export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}
