import { RequestContext } from '../../controller/types/request-context';

export type SecurityValidationFunction = (requestContext: RequestContext) => Promise<boolean>;
