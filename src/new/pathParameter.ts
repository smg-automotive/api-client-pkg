type PathParameterName<P extends string> =
  P extends `${infer _Head}/{${infer Parameter}}${infer Tail}`
    ? Parameter | PathParameterName<Tail>
    : never;

export type PathParameters<P extends string> = Record<
  PathParameterName<P>,
  string | number
>;

// type TestWithParams = PathParameters<'/test/{foo}/bar/{baz}'>
// {
//   foo: string | number;
//   baz: string | number;
// }

// type TestWithoutParams = PathParameters<'/test'>
// {}
