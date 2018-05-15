import { RequestContext } from './request-context';

/**
 * Represents the signature of a function used as a serializer
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 */
export type SerializerFunction = (context: RequestContext) => Promise<any>;
