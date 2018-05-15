import { FrameworkHooksEnum } from '../enums/framework-hooks.enum';

/**
 * Represents the type of the hook, its name and its body (its function)
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface HookEntry
 */
export interface HookEntry {
    type: FrameworkHooksEnum;
    name?: string;
    body: Function;
}
