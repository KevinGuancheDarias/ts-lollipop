import { HookEntry } from './hook/types/hook-entry';
import { LifeCycleLollipopError } from './errors/lifecycle-lollipop.error';
import { ReadOnlyLollipopError } from './errors/read-only.lollipop.error';
import { LollipopLogger } from './log/lollipop-logger';
import { Lollipop } from './lollipop';
import { DiLollipopModule } from './di/di-lollipop.module';

export class ContextHolder {
    private static readonly _LOGGER: LollipopLogger = new LollipopLogger(ContextHolder);
    private static _diModule: DiLollipopModule;
    private static _lollipopInstance: Lollipop;

    /**
     * Returns the stored hooks <br>
     * <b>Returns a copy of the array </b>
     *
     * @readonly
     * @static
     * @type {HookEntry[]}
     * @memberof ContextHolder
     */
    public static get hookSimpleStorage(): HookEntry[] {
        return [...this._hookSimpleStorage];
    }

    public static set hookSimpleStorage(value: HookEntry[]) {
        ContextHolder._LOGGER.error('Cannot define hookSimpleStorage with value ' + JSON.stringify(value));
        throw new ReadOnlyLollipopError();
    }

    /**
     * Stores the hooks, <b>only</b> while the <i>_lollipopInstance</i> is undefined
     *
     * @private
     * @static
     * @type {HookEntry[]}
     * @memberof ContextHolder
     */
    private static _hookSimpleStorage: HookEntry[] = [];

    private static _isStarted = false;

    /**
     * Returns the DI Module
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @returns {DiLollipopModule}
     * @throws {LifeCycleLollipopError} When diModule is not defined (probably because called before it's cycle is in)
     * @memberof Lollipop
     */
    public static getDiModule(): DiLollipopModule {
        if (!ContextHolder._diModule) {
            throw new LifeCycleLollipopError('Can NOT get DI module, action only supported after cycle DI_AFTER_COMPONENT_SCAN');
        }
        return ContextHolder._diModule;
    }

    /**
     * Defines the di module
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {DiLollipopModule} value Instance of DI module
     * @throws {LifeCycleLollipopError} Trying to define it when context is started
     * @memberof ContextHolder
     */
    public static setDiModule(value: DiLollipopModule): void {
        if (ContextHolder._isStarted) {
            throw new LifeCycleLollipopError('Can NOT define DI module when context is started');
        }
        ContextHolder._diModule = value;
    }

    /**
     * Registers hooks <br>
     * <b>NOTICE:</b> This method, should not be used by application code, only by framework modules
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {...HookEntry[]} hookEntry Entries to register
     * @memberof ContextHolder
     */
    public static registerHooks(...hookEntry: HookEntry[]): void {
        if (this._lollipopInstance) {
            hookEntry.forEach(current => this._lollipopInstance.registerHook(current.type, current.body, current.name));
        } else {
            ContextHolder.checkIsStarted('Can\'t invoke ContextHolder.registerHooks when framework is marked as started');
            ContextHolder._hookSimpleStorage = ContextHolder._hookSimpleStorage.concat(hookEntry);
        }
    }

    /**
     * Checks if the ContextHolder is set as started
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string} [message='Unexpected lifecycle error']
     * @returns {typeof ContextHolder} context holder
     * @throws {LifeCycleLollipopError} When context is not started
     * @memberof ContextHolder
     */
    public static checkIsStarted(message = 'Unexpected lifecycle error'): typeof ContextHolder {
        if (ContextHolder._isStarted) {
            throw new LifeCycleLollipopError(message);
        }
        return ContextHolder;
    }

    /**
     * Sets the ContextHolder as started, disallowing the hook manipulation
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @memberof ContextHolder
     * @returns {ContextHolder}
     */
    public static defineAsStarted(): typeof ContextHolder {
        ContextHolder._isStarted = true;
        return ContextHolder;
    }

    /**
     * Returns the Lollipop instance
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @returns {Lollipop}
     * @throws {LifeCycleLollipopError} When this function is invoked before the Context has been defined as ready
     * @memberof ContextHolder
     */
    public static getLollipop(): Lollipop {
        return ContextHolder._lollipopInstance;
    }

    /**
     * Defines the Lollipop instance, and also <b>registers the associated hooks</b>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {Lollipop} value Lollipop instance
     * @throws {LifeCycleLollipopError} Can't define Lollipop instance when context is already started
     * @memberof ContextHolder
     */
    public static defineLollipopInstance(value: Lollipop) {
        if (ContextHolder._isStarted) {
            throw new LifeCycleLollipopError('Cannot set Lollipop instance in ContextHolder, because the context is started');
        }
        ContextHolder._lollipopInstance = value;
        this._hookSimpleStorage.forEach(current => this._lollipopInstance.registerHook(current.type, current.body, current.name));
    }

    private constructor() {
        // Can't instantiate this class
    }
}
