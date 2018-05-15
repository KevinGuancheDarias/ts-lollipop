/**
 * Represents a component pair "constructor" and identifier
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface ComponentType
 */
export interface ComponentType {
    constructor: FunctionConstructor;
    identifier?: string;
}
