import { Entity } from '../../@shared/domain/Entity';
import { UUID } from '../../@shared/domain/value-object/uuid';
import { CategoryFakeBuilder } from './CategoryFakeBuilder';
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
  }

  get id(): UUID {
    return this._id;
  }

  static create(command: CategoryCreateCommand): Category {
    const category = new Category(command);
    category.validate(['name']);
    return category;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  update(name: string, description: string): void {
    this.name = name;
    this.description = description;
    this.validate(['name']);
  }

  activate(): void {
    this.active = true;
  }

  deactivate(): void {
    this.active = false;
  }

  toJSON() {
    return {
      id: this._id.id,
      name: this.name,
      description: this.description,
      active: this.active,
      createdAt: this.createdAt,
    };
  }

  validate(fields?: string[]): boolean {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake(): typeof CategoryFakeBuilder {
    return CategoryFakeBuilder;
  }
}
