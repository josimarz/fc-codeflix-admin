import { SortDirection } from '../../../../@shared/domain/repository/SearchParams';
import { UUID } from '../../../../@shared/domain/value-object/uuid';
import { InMemorySearchableRepository } from '../../../../@shared/infra/db/in-memory/InMemorySearchableRepository';
import { Category } from '../../../domain/Category';
import { CategoryRepository } from '../../../domain/CategoryRepository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, UUID>
  implements CategoryRepository
{
  protected async applyFilter(
    items: Category[],
    filter: string,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected applySort(
    items: Category[],
    sort: string,
    sortDir: SortDirection | null,
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sortDir)
      : super.applySort(items, 'createdAt', 'desc');
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
