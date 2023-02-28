export type PaginationResponseData = {
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};

export type PaginatedResponse<ContentType> = PaginationResponseData & {
  content: ContentType[];
};

export type PaginationQuery = {
  page?: number;
  size?: number;
};

export type PaginatedQuery<QueryType> = {
  query: QueryType;
  pagination: PaginationQuery;
};
