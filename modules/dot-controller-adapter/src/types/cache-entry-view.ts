
/**
 * Represents a cached view
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface CacheEntryView
 */
export interface InMemoryCacheEntryView {
    file: string;
    template: Function;
    mtime: Date;
}
