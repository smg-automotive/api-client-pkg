import { PathParameters } from './pathParameters';
import { ClientConfiguration } from './configuration';

export type Path<Configuration extends ClientConfiguration> = <
  P extends keyof Configuration
>(
  path: P,
  params?: PathParameters<P & string>
) => Configuration[P];
