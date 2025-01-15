type PathParameterName<P extends string> =
  P extends `${infer _Head}/{${infer Parameter}}${infer Tail}`
    ? Parameter | PathParameterName<Tail>
    : never;

export type PathParameters<P extends string> = Record<
  PathParameterName<P>,
  string | number
>;

const paramName = (param: string) => param.replace(/[{}]/g, '');

export const replaceParameters = ({
  path,
  params,
}: {
  path: string;
  params?: Record<string, string | number>;
}) => {
  const parameters = path.match(/{([A-Za-z0-9_-]+)}/g) || [];

  if (parameters.length === 0) {
    return path;
  }

  let replacedPath = path;
  parameters.forEach((paramPattern) => {
    const name = paramName(paramPattern);
    const value = params?.[name];

    if (!value) {
      throw new Error(
        `Parameter ${name} missing. Expected parameters are: ${parameters
          .map(paramName)
          .join(', ')}`,
      );
    }

    replacedPath = replacedPath.replace(paramPattern, `${value}`);
  });
  return replacedPath;
};
