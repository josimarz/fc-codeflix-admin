import { Chance } from 'chance';
import { UUID } from '../../@shared/domain/value-object/uuid';
import { Category } from './Category';

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private _id: PropOrFactory<UUID> | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _name: PropOrFactory<string> = (_index) => this.chance.word();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _description: PropOrFactory<string | null> = (_index) =>
    this.chance.paragraph();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _active: PropOrFactory<boolean> = (_index) => true;
  // auto generated in entity
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private count: number = 0;
  private chance: Chance.Chance;

  static aCategory(): CategoryFakeBuilder<Category> {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(count: number): CategoryFakeBuilder<Category[]> {
    return new CategoryFakeBuilder<Category[]>(count);
  }

  private constructor(count: number = 1) {
    this.count = count;
    this.chance = Chance();
  }

  withUUID(valueOrFactory: PropOrFactory<UUID>): CategoryFakeBuilder {
    this._id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>): CategoryFakeBuilder {
    this._name = valueOrFactory;
    return this;
  }

  withDescription(
    valueOrFactory: PropOrFactory<string | null>,
  ): CategoryFakeBuilder {
    this._description = valueOrFactory;
    return this;
  }

  activate(): CategoryFakeBuilder {
    this._active = true;
    return this;
  }

  deactivate(): CategoryFakeBuilder {
    this._active = false;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>): CategoryFakeBuilder {
    this._createdAt = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string): CategoryFakeBuilder {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.count).fill(undefined).map((_, index) => {
      const category = new Category({
        id: !this._id ? undefined : this.callFactory(this._id, index),
        name: this.callFactory(this._name, index),
        description: this.callFactory(this._description, index),
        active: this.callFactory(this._active, index),
        ...(this._createdAt && {
          createdAt: this.callFactory(this._createdAt, index),
        }),
      });
      return category;
    });
    return this.count === 1 ? (categories[0] as any) : categories;
  }

  get id() {
    return this.getValue('id');
  }

  get name() {
    return this.getValue('name');
  }

  get description() {
    return this.getValue('description');
  }

  get active() {
    return this.getValue('active');
  }

  get createdAt() {
    return this.getValue('createdAt');
  }

  private getValue(prop: any): any {
    const optional = ['id', 'createdAt'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} does not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number): any {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
