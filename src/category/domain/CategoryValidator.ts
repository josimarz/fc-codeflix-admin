import { MaxLength } from 'class-validator';
import { Notification } from 'src/@shared/domain/validator/Notification';
import { ClassValidatorFields } from '../../@shared/domain/validator/ClassValidatorFields';
import { Category } from './Category';

class Rules {
  @MaxLength(255, { groups: ['name'] })
  readonly name: string;

  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const f = fields?.length ? fields : ['name'];
    return super.validate(notification, new Rules(data), f);
  }
}

export class CategoryValidatorFactory {
  static create(): CategoryValidator {
    return new CategoryValidator();
  }
}
