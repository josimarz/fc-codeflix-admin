import { ValueObject } from 'src/@shared/domain/ValueObject';
import { Entity } from '../../@shared/domain/Entity';
import { EntityValidationError } from '../../@shared/domain/validator/EntityValidationError';
import { UUID } from '../../@shared/domain/value-object/uuid';
import { CategoryValidatorFactory } from './CategoryValidator';

export type CategoryProps = {
  readonly id?: UUID;
  readonly name: string;
  readonly description?: string;
  readonly active?: boolean;
  readonly createdAt?: Date;
};

export type CategoryCreateCommand = {
  readonly name: string;
  readonly description?: string;
  readonly active?: boolean;
};

export class Category extends Entity {
  _id: UUID;
  name: string;
  description: string;
  active: boolean;
  createdAt: Date;

  constructor(props: CategoryProps) {
    super();
    this._id = props.id ?? new UUID();
    this.name = props.name;
    this.description = props.description ?? null;
    this.active = props.active ?? true;
    this.createdAt = props.createdAt || new Date();
    Category.validate(this);
  }

  get id(): ValueObject {
    return this._id;
  }

  static create(command: CategoryCreateCommand): Category {
    return new Category(command);
  }

  changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string): void {
    this.description = description;
    Category.validate(this);
  }

  update(name: string, description: string): void {
    this.name = name;
    this.description = description;
    Category.validate(this);
  }

  activate(): void {
    this.active = true;
    Category.validate(this);
  }

  deactivate(): void {
    this.active = false;
    Category.validate(this);
  }

  toJSON() {
    return {
      id: this._id,
      name: this.name,
      description: this.description,
      active: this.active,
      createdAt: this.createdAt,
    };
  }

  static validate(category: Category): void {
    const validator = CategoryValidatorFactory.create();
    if (!validator.validate(category)) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
