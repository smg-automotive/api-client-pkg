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
