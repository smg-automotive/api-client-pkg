import { RemoveIndex } from './utils';
import { PathParameters } from './pathParameters';
import { ClientConfiguration } from './configuration';

export type Path<Configuration extends ClientConfiguration> = <
  P extends keyof RemoveIndex<Configuration>
>(
  path: P,
  params?: PathParameters<P & string>
) => Configuration[P];
