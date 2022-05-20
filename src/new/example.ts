import { Response } from './response';
import { ClientConfiguration } from './configuration';

import { StronglyTypedClient } from '.';

type Book = {
  author: string;
  title: string;
  id: number;
};

interface LibraryConfiguration extends ClientConfiguration {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/books': {
    get: () => Promise<Response<Book[]>>;
    post: (data: Book) => Promise<Response>;
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '/books/{id}': {
    get: () => Promise<Response<Book>>;
  };
}

const libraryClient = StronglyTypedClient<LibraryConfiguration>();

const bookResponse = await libraryClient.path('/books/{id}', { id: 3 }).get();

if (bookResponse.status === 200) {
  // eslint-disable-next-line no-console
  console.log(bookResponse.body.title);
} else {
  // eslint-disable-next-line no-console
  console.log(bookResponse.body?.message);
}
