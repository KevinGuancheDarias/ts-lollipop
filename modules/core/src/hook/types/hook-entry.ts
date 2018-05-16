import { FrameworkHooksEnum } from '../enums/framework-hooks.enum';

/**
 * Represents the type of the hook, its name and its body (its function)
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface HookEntry
 */
export interface HookEntry {
    /**
     *
     *
     * @type {FrameworkHooksEnum}
     * @since 0.1.0
     * @memberof HookEntry
     */
    type: FrameworkHooksEnum;

    /**
     *
     *
     * @type {string}
     * @since 0.1.0
     * @memberof HookEntry
     */
    name?: string;

    /**
     *
     *
     * @type {Function}
     * @since 0.1.0
     * @memberof HookEntry
     */
    body: Function;
}
