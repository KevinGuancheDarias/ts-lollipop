import { LollipopError } from './lollipop.error';

/**
 * Thrown when passed information to framework functions, is incorrect
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class BadInputLollipopError
 * @extends {LollipopError}
 */
export class BadInputLollipopError extends LollipopError {
    public static fromBuilder(): BadInputLollipopError {
        return new BadInputLollipopError(
            'For readability reasons, it\'s better, to initialize builders with a static method, that method usually is "build()"'
        );
    }
}
