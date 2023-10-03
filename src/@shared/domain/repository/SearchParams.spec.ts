import { SearchParams } from './SearchParams';

describe('[SearchParams] Unit Test', () => {
  describe('page', () => {
    const params = new SearchParams();
    expect(params.page).toBe(1);

    const cases: { page: any; expected: number }[] = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'invalid', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];

    test.each(cases)(
      '%p',
      ({ page, expected }: { page: any; expected: number }) => {
        expect(new SearchParams({ page }).page).toBe(expected);
      },
    );
  });

  describe('perPage', () => {
    const params = new SearchParams();
    expect(params.perPage).toBe(15);

    const cases: { perPage: any; expected: number }[] = [
      { perPage: null, expected: 15 },
      { perPage: undefined, expected: 15 },
      { perPage: '', expected: 15 },
      { perPage: 'invalid', expected: 15 },
      { perPage: 0, expected: 15 },
      { perPage: -1, expected: 15 },
      { perPage: 5.5, expected: 15 },
      { perPage: true, expected: 15 },
      { perPage: false, expected: 15 },
      { perPage: {}, expected: 15 },
    ];

    test.each(cases)(
      '%p',
      ({ perPage, expected }: { perPage: any; expected: number }) => {
        expect(new SearchParams({ perPage }).perPage).toBe(expected);
      },
    );
  });

  describe('sort', () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    const cases: { sort: any; expected: string }[] = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: 'field', expected: 'field' },
    ];

    test.each(cases)(
      '%p',
      ({ sort, expected }: { sort: any; expected: string }) => {
        expect(new SearchParams({ sort }).sort).toBe(expected);
      },
    );
  });

  describe('sortDir', () => {
    const params = new SearchParams();
    expect(params.sortDir).toBeNull();

    const sortCases: { sort: any; expected: string }[] = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
    ];

    test.each(sortCases)(
      '%p',
      ({ sort, expected }: { sort: any; expected: string }) => {
        expect(new SearchParams({ sort }).sortDir).toBe(expected);
      },
    );

    const cases: { sortDir: any; expected: string }[] = [
      { sortDir: null, expected: 'asc' },
      { sortDir: undefined, expected: 'asc' },
      { sortDir: '', expected: 'asc' },
      { sortDir: 0, expected: 'asc' },
      { sortDir: 'invalid', expected: 'asc' },
      { sortDir: 'asc', expected: 'asc' },
      { sortDir: 'ASC', expected: 'asc' },
      { sortDir: 'desc', expected: 'desc' },
      { sortDir: 'DESC', expected: 'desc' },
    ];

    test.each(cases)(
      '%p',
      ({ sortDir, expected }: { sortDir: any; expected: string }) => {
        expect(new SearchParams({ sort: 'field', sortDir }).sortDir).toBe(
          expected,
        );
      },
    );
  });

  describe('filter', () => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();

    const cases: { filter: any; expected: string }[] = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: null },
      { filter: 0, expected: '0' },
      { filter: -1, expected: '-1' },
      { filter: 5.5, expected: '5.5' },
      { filter: true, expected: 'true' },
      { filter: false, expected: 'false' },
      { filter: {}, expected: '[object Object]' },
      { filter: 'field', expected: 'field' },
    ];

    test.each(cases)(
      '%p',
      ({ filter, expected }: { filter: any; expected: string }) => {
        expect(new SearchParams({ filter }).filter).toBe(expected);
      },
    );
  });
});
