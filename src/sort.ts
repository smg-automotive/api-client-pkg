export enum SortOrderParams {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type SortParams<T> = {
  sortOrder?: SortOrderParams;
  sortType?: T;
};

export type SortQuery<T> = Array<SortParams<T>>;

export type SortedQuery<QueryType, SortType> = {
  query: QueryType;
  sort: Array<SortParams<SortType>>;
};
