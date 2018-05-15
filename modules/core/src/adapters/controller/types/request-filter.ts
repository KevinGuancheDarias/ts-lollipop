import { RequestContext } from './request-context';

/**
 * An Empty request filter
 */
export const EMPTY_REQUEST_FILTER: RequestFilter = {
    body: async () => true
};

/**
 * Represents a filter for the request
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface RequestFilter
 */
export interface RequestFilter {
    name?: string;

    /**
     * If return value is false, will not execute the controller method, and will not follow the filter chain
     *
     * @memberof RequestFilter
     */
    body: (requestContext: RequestContext) => Promise<boolean>;
}
