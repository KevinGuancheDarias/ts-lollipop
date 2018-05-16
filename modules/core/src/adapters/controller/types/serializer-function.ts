import { RequestContext } from './request-context';

/**
 * Represents the signature of a function used as a serializer
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @since 0.1.0
 */
export type SerializerFunction = (context: RequestContext) => Promise<any>;
