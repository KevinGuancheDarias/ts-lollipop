import { Constructor } from '../../types/constructor';

/**
 * Represents a component pair "constructor" and identifier
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface ComponentType
 */
export interface ComponentType<T extends Constructor<T> = any> {
    constructor: Constructor<T>;
    identifier?: string;
}
