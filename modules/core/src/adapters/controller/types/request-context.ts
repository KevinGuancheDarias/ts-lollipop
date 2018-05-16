import { LollipopRequest } from '../pojos/lollipop-request';
import { LollipopResponse } from './lollipop-response';

/**
 * Represents the available request context, that a Serializer can use
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface SerializerContext
 */
export interface RequestContext {
    /**
     *
     *
     * @type {LollipopRequest}
     * @since 0.1.0
     * @memberof RequestContext
     */
    request: LollipopRequest;

    /**
     *
     *
     * @type {LollipopResponse}
     * @since 0.1.0
     * @memberof RequestContext
     */
    response: LollipopResponse;
}
