/**
 * Represents a constructor
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface Constructor
 * @extends {Function}
 * @template T class
 */
export interface Constructor<T> extends Function {
    new(...args: any[]): T;
}
