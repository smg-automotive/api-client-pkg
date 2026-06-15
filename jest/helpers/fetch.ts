import { fetchMock } from '@/jest/setup/fetchMock';

export const mockResolvedOnce = (value: unknown) => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      status: 200,
      ok: true,
      text: () => {
        return Promise.resolve(JSON.stringify(value));
      },
    }),
  );
};

export const mockResolvedStreamOnce = (
  value: ReadableStream<Uint8Array> = new ReadableStream<Uint8Array>(),
) => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      status: 200,
      ok: true,
      body: value,
    }),
  );
};

export const mockMissingStreamBodyOnce = () => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      status: 200,
      ok: true,
      body: null,
      url: 'https://api.automotive.ch/api/listings/create-stream',
    }),
  );
};

export const mockFetchFailOnce = () => {
  fetchMock.mockReturnValueOnce(Promise.reject(new Error()));
};

export const mockApiFailOnce = () => {
  fetchMock.mockReturnValueOnce(
    Promise.resolve({
      ok: false,
      statusText: 'Wrong data format',
      status: 400,
      text: () => {
        return Promise.resolve(
          JSON.stringify({
            message: 'Wrong data format',
          }),
        );
      },
    }),
  );
};

export const mockUnexpectedHTMLOnce = () => {
  fetchMock.mockImplementationOnce((url) =>
    Promise.resolve({
      url,
      ok: true,
      status: 200,
      text: () => {
        return Promise.resolve(
          '<html><body>You have been blocked</body></html>',
        );
      },
    }),
  );
};
