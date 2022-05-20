import { StronglyTypedClient } from '.';

type Book = {
  author: string;
  title: string;
  id: number;
};

type LibraryConfiguration = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/books': {
    get: () => Promise<Book[]>;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/books/{id}': {
    get: () => Promise<Book>;
  };
};

const libraryClient = StronglyTypedClient<LibraryConfiguration>();

const _books = await libraryClient.path('/books').get();
