import { Op } from 'sequelize';
import { NotFoundError } from '../../../../@shared/domain/error/NotFoundError';
import { UUID } from '../../../../@shared/domain/value-object/uuid';
import { Category } from '../../../domain/Category';
import {
  CategoryRepository,
  CategorySearchParams,
  CategorySearchResult,
} from '../../../domain/CategoryRepository';
import { CategoryModel } from './CategoryModel';
import { CategoryModelMapper } from './CategoryModelMapper';

export class CategorySequelizeRepository implements CategoryRepository {
  sortableFields: string[];

  constructor(private model: typeof CategoryModel) {
    this.sortableFields = ['name', 'createdAt'];
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.perPage;
    const limit = props.perPage;
    const { rows, count } = await this.model.findAndCountAll({
      ...(props.filter && {
        where: {
          name: {
            [Op.like]: `%${props.filter}%`,
          },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sortDir]] }
        : { order: [['createdAt', 'desc']] }),
      offset,
      limit,
    });
    return new CategorySearchResult({
      items: rows.map((row) => CategoryModelMapper.toEntity(row)),
      currentPage: props.page,
      perPage: props.perPage,
      total: count,
    });
  }

  async insert(entity: Category): Promise<void> {
    const model = CategoryModelMapper.toModel(entity);
    this.model.create(model.toJSON());
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const props = entities.map((entity) =>
      CategoryModelMapper.toModel(entity).toJSON(),
    );
    await this.model.bulkCreate(props);
  }

  async update(entity: Category): Promise<void> {
    const item = await this.model.findByPk(entity.id.id);
    if (!item) {
      throw new NotFoundError(entity.id.id, this.getEntity());
    }
    const model = CategoryModelMapper.toModel(entity);
    await this.model.update(model.toJSON(), {
      where: { id: entity.id.id },
    });
  }

  async delete(id: UUID): Promise<void> {
    const item = await this.model.findByPk(id.id);
    if (!item) {
      throw new NotFoundError(id.id, this.getEntity());
    }
    const count = await this.model.destroy({ where: { id: id.id } });
    if (!count) {
      throw new NotFoundError(id.id, this.getEntity());
    }
  }

  async findById(id: UUID): Promise<Category> {
    const item = await this.model.findByPk(id.id);
    return item ? CategoryModelMapper.toEntity(item) : null;
  }

  async findAll(): Promise<Category[]> {
    const items = await this.model.findAll();
    return items.map((item) => CategoryModelMapper.toEntity(item));
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
