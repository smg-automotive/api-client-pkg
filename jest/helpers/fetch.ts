import { fetchMock } from '../setup/fetchMock';

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
