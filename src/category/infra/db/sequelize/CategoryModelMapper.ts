import { UUID } from '../../../../@shared/domain/value-object/uuid';
import { Category } from '../../../domain/Category';
import { CategoryModel } from './CategoryModel';

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      id: entity.id.id,
      name: entity.name,
      description: entity.description,
      active: entity.active,
      createdAt: entity.createdAt,
    });
  }

  static toEntity(model: CategoryModel): Category {
    return new Category({
      id: new UUID(model.id),
      name: model.name,
      description: model.description,
      active: model.active,
      createdAt: model.createdAt,
    });
  }
}
