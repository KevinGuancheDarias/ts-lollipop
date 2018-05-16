import { RequestContext } from './request-context';

/**
 * An Empty request filter
 * @since 0.1.0
 */
export const EMPTY_REQUEST_FILTER: RequestFilter = {
    body: async () => true
};

/**
 * Represents a filter for the request
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface RequestFilter
 */
export interface RequestFilter {
    /**
     *
     *
     * @type {string}
     * @since 0.1.0
     * @memberof RequestFilter
     */
    name?: string;

    /**
     * If return value is false, will not execute the controller method, and will not follow the filter chain
     *
     * @since 0.1.0
     * @memberof RequestFilter
     */
    body: (requestContext: RequestContext) => Promise<boolean>;
}
