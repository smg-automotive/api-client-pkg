/* eslint-disable @typescript-eslint/naming-convention */
import { ResponseType } from './responseType';

import { ClientConfiguration } from './configuration';

import { ApiClient } from './index';

type Book = {
  author: string;
  title: string;
  id: number;
};

interface LibraryConfiguration extends ClientConfiguration {
  '/books': {
    get: () => Promise<ResponseType<Book[]>>;
    post: ({ data }: { data: Book }) => Promise<ResponseType>;
  };
  '/books/{id}': {
    get: () => Promise<ResponseType<Book>>;
  };
}

const libraryClient = ApiClient<LibraryConfiguration>();

const bookResponse = await libraryClient.path('/books/{id}', { id: 3 }).get();

if (bookResponse.status === 200) {
  // eslint-disable-next-line no-console
  console.log(bookResponse.body.title);
} else {
  // eslint-disable-next-line no-console
  console.log(bookResponse.body?.message);
}
