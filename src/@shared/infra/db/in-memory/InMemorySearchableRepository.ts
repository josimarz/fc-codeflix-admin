import { Entity } from '../../../domain/Entity';
import { ValueObject } from '../../../domain/ValueObject';
import { SearchableRepository } from '../../../domain/repository/Repository';
import {
  SearchParams,
  SortDirection,
} from '../../../domain/repository/SearchParams';
import { SearchResult } from '../../../domain/repository/SearchResult';
import { InMemoryRepository } from './InMemoryRepository';

export abstract class InMemorySearchableRepository<
    T extends Entity,
    U extends ValueObject,
    F = string,
  >
  extends InMemoryRepository<T, U>
  implements SearchableRepository<T, U, F>
{
  sortableFields: string[];

  constructor() {
    super();
    this.sortableFields = [];
  }

  async search(props: SearchParams<F>): Promise<SearchResult<T>> {
    const filtered = await this.applyFilter(this.items, props.filter);
    const sorted = this.applySort(filtered, props.sort, props.sortDir);
    const paginated = this.applyPagination(sorted, props.page, props.perPage);
    return new SearchResult({
      items: paginated,
      total: filtered.length,
      currentPage: props.page,
      perPage: props.perPage,
    });
  }

  protected abstract applyFilter(items: T[], filter: F | null): Promise<T[]>;

  protected applyPagination(
    items: T[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ) {
    const start = (page - 1) * perPage;
    const limit = start + perPage;
    return items.slice(start, limit);
  }

  protected applySort(
    items: T[],
    sort: string | null,
    sortDir: SortDirection | null,
    customGetter?: (sort: string, item: T) => any,
  ) {
    if (!sort || this.sortableFields.includes(sort)) {
      return items;
    }
    return [...items].sort((a, b) => {
      const aValue = customGetter ? customGetter(sort, a) : a[sort];
      const bValue = customGetter ? customGetter(sort, b) : b[sort];
      if (aValue < bValue) {
        return sortDir === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
