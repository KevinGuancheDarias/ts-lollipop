/**
 * Magic type passing to children classes
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @interface StaticThis
 * @template T Just magic, don't ask
 * @see https://github.com/Microsoft/TypeScript/issues/5863#issuecomment-302891200
 */
export interface StaticThis<T> {
    new(): T;
};

export abstract class AbstractBuilder {

    /**
     * Creates an instance of the builder <br>
     * While you can use this constructor, it's more readable to use this method
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @template T
     * @param {StaticThis<T>} this Magic
     * @returns {T} builder instance
     * @memberof AbstractBuilder
     */
    public static build<T extends AbstractBuilder>(this: StaticThis<T>): T {
        return new this();
    }
}
