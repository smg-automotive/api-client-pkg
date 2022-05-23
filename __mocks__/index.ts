export const ApiClient = () => ({
  path: () => {
    return {
      get: jest
        .fn()
        .mockReturnValue(Promise.resolve({ status: 200, body: {}, ok: true })),
      post: jest
        .fn()
        .mockReturnValue(Promise.resolve({ status: 201, body: {}, ok: true })),
      put: jest
        .fn()
        .mockReturnValue(Promise.resolve({ status: 204, body: {}, ok: true })),
      delete: jest
        .fn()
        .mockReturnValue(Promise.resolve({ status: 204, body: {}, ok: true })),
    };
  },
});
