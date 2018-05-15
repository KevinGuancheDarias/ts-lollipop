import { LollipopError } from '../../errors/lollipop.error';

/**
 * Thrown when the DI engine  detects a circular reference
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class CircularDependencyError
 * @extends {LollipopError}
 */
export class CircularDependencyError extends LollipopError {

}
