import { SearchableRepository } from '../../@shared/domain/repository/Repository';
import { SearchParams } from '../../@shared/domain/repository/SearchParams';
import { SearchResult } from '../../@shared/domain/repository/SearchResult';
import { UUID } from '../../@shared/domain/value-object/uuid';
import { Category } from './Category';

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface CategoryRepository
  extends SearchableRepository<
    Category,
    UUID,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
