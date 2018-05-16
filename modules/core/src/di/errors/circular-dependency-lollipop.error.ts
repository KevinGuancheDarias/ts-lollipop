import { LollipopError } from '../../errors/lollipop.error';

/**
 * Thrown when the DI engine  detects a circular reference
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class CircularDependencyError
 * @since 0.1.0
 * @extends {LollipopError}
 */
export class CircularDependencyError extends LollipopError {

}
