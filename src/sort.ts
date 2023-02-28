export enum SortOrderParams {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type SortParams<T> = {
  order: SortOrderParams;
  type: T;
};

export type SortQuery<T> = Array<SortParams<T>>;

export type SortedQuery<QueryType, SortType> = {
  query: QueryType;
  sort: Array<SortParams<SortType>>;
};
