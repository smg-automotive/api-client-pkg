type Methods = {
  get?: (data?: unknown) => Promise<unknown>;
  post?: (data?: unknown) => Promise<unknown>;
  put?: (data?: unknown) => Promise<unknown>;
  delete?: (data?: unknown) => Promise<unknown>;
};

export type ClientConfiguration = Record<string, Methods>;
