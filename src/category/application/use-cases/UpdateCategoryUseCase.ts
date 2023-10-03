import { UseCase } from '../../../@shared/application/UseCase';
import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import { UUID } from '../../../@shared/domain/value-object/uuid';
import { Category } from '../../domain/Category';
import { CategoryRepository } from '../../domain/CategoryRepository';
import { CategoryOutput, CategoryOutputMapper } from './common/CategoryOutput';

export type UpdateCategoryInput = {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly active?: boolean;
};

export type UpdateCategoryOutput = CategoryOutput;

export class UpdateCategoryUseCase
  implements UseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private repository: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const category = await this.repository.findById(new UUID(input.id));
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }
    input.name && category.changeName(input.name);

    if ('description' in input) {
      input.description && category.changeDescription(input.description);
    }

    if (input.active === true) {
      category.activate();
    }
    if (input.active === false) {
      category.deactivate();
    }

    await this.repository.update(category);
    return CategoryOutputMapper.toOutput(category);
  }
}
