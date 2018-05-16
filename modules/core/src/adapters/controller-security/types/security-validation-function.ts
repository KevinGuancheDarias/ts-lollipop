import { RequestContext } from '../../controller/types/request-context';

/**
 * @since 0.1.0
 */
export type SecurityValidationFunction = (requestContext: RequestContext) => Promise<boolean>;
