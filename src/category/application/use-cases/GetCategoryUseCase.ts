import { UseCase } from '../../../@shared/application/UseCase';
import { NotFoundError } from '../../../@shared/domain/error/NotFoundError';
import { UUID } from '../../../@shared/domain/value-object/uuid';
import { Category } from '../../domain/Category';
import { CategoryRepository } from '../../domain/CategoryRepository';
import { CategoryOutput, CategoryOutputMapper } from './common/CategoryOutput';

export type GetCategoryInput = {
  readonly id: string;
};

export type GetCategoryOutput = CategoryOutput;

export class GetCategoryUseCase
  implements UseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const category = await this.repository.findById(new UUID(input.id));
    if (!category) {
      throw new NotFoundError(input.id, Category);
    }
    return CategoryOutputMapper.toOutput(category);
  }
}
