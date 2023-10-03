import { Category } from '../../../domain/Category';

export type CategoryOutput = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly active: boolean;
  readonly createdAt: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    return {
      id: entity.id.id,
      name: entity.name,
      description: entity.description,
      active: entity.active,
      createdAt: entity.createdAt,
    };
  }
}
