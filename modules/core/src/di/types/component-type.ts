import { Constructor } from '../../types/constructor';

/**
 * Represents a component pair "constructor" and identifier
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface ComponentType
 */
export interface ComponentType<T extends Constructor<T> = any> {
    constructor: Constructor<T>;
    identifier?: string;
}
