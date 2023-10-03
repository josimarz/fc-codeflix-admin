import { UseCase } from '../../../@shared/application/UseCase';
import { Category } from '../../domain/Category';
import { CategoryRepository } from '../../domain/CategoryRepository';
import { CategoryOutput, CategoryOutputMapper } from './common/CategoryOutput';

export type CreateCategoryInput = {
  readonly name: string;
  readonly description?: string | null;
  readonly active?: boolean;
};

export type CreateCategoryOuput = CategoryOutput;

export class CreateCategoryUseCase
  implements UseCase<CreateCategoryInput, CreateCategoryOuput>
{
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOuput> {
    const entity = Category.create(input);
    await this.repository.insert(entity);
    return CategoryOutputMapper.toOutput(entity);
  }
}
