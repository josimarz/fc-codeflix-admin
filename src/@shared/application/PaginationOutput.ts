import { SearchResult } from '../domain/repository/SearchResult';

export type PaginationOutput<Item = any> = {
  readonly items: Item[];
  readonly total: number;
  readonly currentPage: number;
  readonly lastPage: number;
  readonly perPage: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    props: Omit<SearchResult, 'items'>,
  ): PaginationOutput<Item> {
    return {
      items,
      total: props.total,
      currentPage: props.currentPage,
      lastPage: props.lastPage,
      perPage: props.perPage,
    };
  }
}
