/**
 * Represents a constructor
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface Constructor
 * @extends {Function}
 * @template T class
 */
export interface Constructor<T> extends Function {
    new(...args: any[]): T;
}
