import { HookEntry } from './types/hook-entry';
import { PromiseUtil } from '../utils/promise.util';

/**
 * Represents a hook storage
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class HookStorage
 */
export class HookStorage {
    private _unnamedHooks: Function[] = [];
    private _namedHooksMap: string[] = [];
    private _namedHooks: { [key: string]: Function } = {};

    public constructor(...initHooks: HookEntry[]) {
        if (initHooks) {
            initHooks.forEach(currentHook => {
                this.registerHook(currentHook.body, currentHook.name);
            });
        }
    }

    /**
     * Registers a <b>unnamed</b> hook
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {Function} hookBody body of the hook
     * @returns {number}  Index in the unnamed array
     * @memberof HookStorage
     */
    public registerHook(hookBody: Function): number;

    /**
     * Registers a hook <b>WITH name</b>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {Function} hookBody
     * @param {string} name
     * @memberof HookStorage
     */
    public registerHook(hookBody: Function, name: string): void;

    /**
     * Registers a hook in the storage
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {Function} hookBody hook to execute
     * @param {string} [name] Name of the hook, if not specified, not be easy to identify the hook
     * @returns {(number | void)} If name is not specified returns the index of the hook in the HookStorage array
     * @memberof HookStorage
     */
    public registerHook(hookBody: Function, name?: string): number | void {
        if (name) {
            this._addNamedHook(name, hookBody);
        } else {
            return this._unnamedHooks.push(hookBody) - 1;
        }
    }

    /**
     * Runs all registered hooks in this storage container
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {*} context Lollipop ContextHolder
     * @returns {Promise<void>} Resolves when all hooks ared resolved (Remember, hooks can return a promise)
     * @memberof HookStorage
     */
    public async runAllHooks(context: any): Promise<void> {
        const hookFunctions: Function[] = (<Function[]>[]).concat(
            this._namedHooksMap.map(currentName => this._namedHooks[currentName]),
            this._unnamedHooks
        );
        await PromiseUtil.runPromisesSequentially(context, hookFunctions);
    }


    private _addNamedHook(name: string, body: Function): void {
        this._namedHooks[name] = body;
        this._namedHooksMap.push(name);
    }
}
