import { LollipopError } from './lollipop.error';

/**
 * Thrown when an unique decorator is used more than once
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class DuplicatedDecoratorLollipopError
 * @extends {LollipopError}
 */
export class DuplicatedDecoratorLollipopError extends LollipopError {

    /**
     * Returns an instance, with default message, using the decorator name to build it
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string} decoratorName Name of the decorator to print in the error
     * @returns {DuplicatedDecoratorLollipopError}
     * @memberof DuplicatedDecoratorLollipopError
     */
    public static fromDecorator(decoratorName: string): DuplicatedDecoratorLollipopError {
        return new DuplicatedDecoratorLollipopError(`Cannot have more than one decorator of type ${decoratorName}`);
    }
}
