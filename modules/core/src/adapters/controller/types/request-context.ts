import { LollipopRequest } from '../pojos/lollipop-request';
import { LollipopResponse } from './lollipop-response';

/**
 * Represents the available request context, that a Serializer can use
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface SerializerContext
 */
export interface RequestContext {
    request: LollipopRequest;
    response: LollipopResponse;
}
