import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../@shared/application/PaginationOutput';
import { UseCase } from '../../../@shared/application/UseCase';
import { SortDirection } from '../../../@shared/domain/repository/SearchParams';
import {
  CategoryFilter,
  CategoryRepository,
  CategorySearchParams,
} from '../../domain/CategoryRepository';
import { CategoryOutput, CategoryOutputMapper } from './common/CategoryOutput';

export type ListCategoriesInput = {
  readonly page?: number;
  readonly perPage?: number;
  readonly sort?: string | null;
  readonly sortDir?: SortDirection | null;
  readonly filter?: CategoryFilter | null;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase
  implements UseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private readonly repository: CategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input);
    const result = await this.repository.search(params);
    return PaginationOutputMapper.toOutput(
      result.items.map((item) => CategoryOutputMapper.toOutput(item)),
      result,
    );
  }
}
