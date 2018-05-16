import { LollipopError } from './lollipop.error';

/**
 * Thrown when trying to access a read only property <br>
 * Usually these properties are written by the framework
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class ReadOnlyLollipopError
 * @since 0.1.0
 * @extends {LollipopError}
 */
export class ReadOnlyLollipopError extends LollipopError {
    public constructor(message = 'Tried to set a readonly property') {
        super(message);
    }
}
