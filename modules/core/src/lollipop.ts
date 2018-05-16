import { HookStorage } from './hook/hook-storage';
import { FrameworkHooksEnum } from './hook/enums/framework-hooks.enum';
import { ContextHolder } from './context-holder';
import { LollipopModuleConstructor, AbstractLollipopModule } from './abstract-lollipop-module';
import { LollipopModulesContainer } from './lollipop-module-map';
import { ConfigurationHolder } from './config/configuration.holder';
import { ModuleTypes } from './enums/module-types.enum';
import { DiLollipopModule } from './di/di-lollipop.module';
import { PromiseUtil } from './utils/promise.util';
import { AbstractControllerAdapterModule } from './adapters/controller/abstract-controller-adapter.module';
import { AbstractDatabaseAdapterModule } from './adapters/database/abstract-database-adapter.module';
import { NotImplementedLoLlipopError } from './errors/not-implemented-lollipop.error';
import { BadInputLollipopError } from './errors/bad-input-lollipop.error';

/**
 * Has the code to boostrap the framework
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @class Lollipop
 */
export class Lollipop {

    private _frameworkHooks: { [key: string]: HookStorage } = {};
    private _registeredModules: LollipopModulesContainer = new LollipopModulesContainer();

    public constructor(private _configFile = 'resources/config.json') {

    }

    /**
     * Finds all the registered modules that matchs the expected type
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T
     * @param {ModuleTypes} type Module type (used to filter)
     * @returns {T[]}
     * @since 0.1.0
     * @memberof Lollipop
     */
    public getRegisteredModulesByType<T extends AbstractLollipopModule>(type: ModuleTypes): T[] {
        return <any>this._registeredModules.getModulesMapAsValuesArray().filter(current => current.getModuleType() === type);
    }

    /**
     * Finds <b>one</b> registered module that matchs the expected type
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @template T
     * @param {ModuleTypes} type
     * @returns {T}
     * @since 0.1.0
     * @memberof Lollipop
     */
    public getRegisteredModuleByType<T extends AbstractLollipopModule>(type: ModuleTypes): T {
        return this.getRegisteredModulesByType<T>(type)[0];
    }

    /**
     * Returns the controller adapters
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {AbstractControllerAdapterModule[]}
     * @since 0.1.0
     * @memberof Lollipop
     */
    public getControllerAdapters(): AbstractControllerAdapterModule[] {
        return this.getRegisteredModulesByType<AbstractControllerAdapterModule>(ModuleTypes.CONTROLLER);
    }

    /**
     * Registers a framework module
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {...LollipopModuleConstructor[]|AbstractLollipopModule[]} modules list of modules to register
     * @returns {Promise<void>} Resolves when all modules are ready
     * @since 0.1.0
     * @memberof Lollipop
     */
    public async registerModules(...modules: (LollipopModuleConstructor | AbstractLollipopModule)[]): Promise<void> {
        ContextHolder.checkIsStarted('Cannot register modules, when context is already started');
        await ConfigurationHolder.loadConfiguration(this._configFile);
        if (modules) {
            for (const currentModule of modules) {
                const instance = currentModule instanceof AbstractLollipopModule
                    ? currentModule
                    : new currentModule();
                await instance.registerModule();
                this._registeredModules.add(instance);
            }
        }
    }

    /**
     * Initializes the framework <br>
     * <b>Remember to register the modules, before calling this method, as will be impossible to register modules after this </b>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {Promise<void>} Resolves when the framework is ready
     * @since 0.1.0
     * @memberof Lollipop
     */
    public async init(): Promise<void> {
        ContextHolder.defineLollipopInstance(this);
        await this._runHookStorage(FrameworkHooksEnum.BEFORE_INIT);
        await this._handleDbInit();
        await this._handleDiInit();
        await this._runHookStorage(FrameworkHooksEnum.CONTEXT_AVAILABLE);
        await this._handleControllersInit();
        await this._runHookStorage(FrameworkHooksEnum.CONTEXT_READY);
        ContextHolder.defineAsStarted();
    }

    /**
     * Registers a hook
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {FrameworkHooksEnum} hookType Type of hook, (ask yourself, when you want ro fire your hook)
     * @param {Function} hookBody function to execute when the hook is triggered
     * @param {Function} [hookName] name of the hook (to identify it better)
     * @since 0.1.0
     * @memberof Lollipop
     */
    public registerHook(hookType: FrameworkHooksEnum, hookBody: Function, hookName?: string): void {
        this._findOrCreateHookStorage(hookType).registerHook(hookBody, hookName);
    }

    private async _handleDbInit(): Promise<void> {
        const dbModules: AbstractDatabaseAdapterModule[] = (
            this.getRegisteredModulesByType<AbstractDatabaseAdapterModule>(ModuleTypes.DATABASE)
        );
        if (dbModules.length > 1) {
            throw new NotImplementedLoLlipopError('Using more than one database module is not actually implemented');
        }
        const dbModule: AbstractDatabaseAdapterModule = dbModules[0];
        if (dbModule) {
            await dbModule.setupConnection();
        }
    }

    private async _handleDiInit(): Promise<void> {
        const diModules: DiLollipopModule[] = this.getRegisteredModulesByType<DiLollipopModule>(ModuleTypes.DI);
        if (diModules.length > 1) {
            throw new NotImplementedLoLlipopError('Using more than one DI module is not actually implemented');
        }
        const diModule: DiLollipopModule = diModules[0];
        if (!diModule) {
            throw new BadInputLollipopError('At least a DI module is required');
        }
        ContextHolder.setDiModule(diModule);
        await PromiseUtil.runPromisesSequentially(
            this,
            diModules.map(current => {
                return () => current.findAndRegisterComponents();
            })
        );
        await this._runHookStorage(FrameworkHooksEnum.DI_AFTER_COMPONENT_SCAN);
        this.getRegisteredModulesByType<DiLollipopModule>(ModuleTypes.DI).forEach(current => {
            current.getContainer().injectAllDependencies();
        });
        await this._runHookStorage(FrameworkHooksEnum.DI_AFTER_INJECT);
        await PromiseUtil.runPromisesSequentially(
            this,
            this.getRegisteredModulesByType<DiLollipopModule>(ModuleTypes.DI).map(current => {
                return () => current.getContainer().triggerPostInject();
            })
        );
        await this._runHookStorage(FrameworkHooksEnum.DI_AFTER_POST_INJECT);
    }

    /**
     * Handles initialization of controllers
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof Lollipop
     */
    private async _handleControllersInit(): Promise<void> {
        const controllerModules: AbstractControllerAdapterModule[] = (
            this.getRegisteredModulesByType<AbstractControllerAdapterModule>(ModuleTypes.CONTROLLER)
        );
        if (controllerModules.length > 1) {
            throw new NotImplementedLoLlipopError('Using more than one controller module is not actually supported');
        }
        await Promise.all(this.getControllerAdapters().map(async current => await current.scanControllers()));
        await this._runHookStorage(FrameworkHooksEnum.CONTROLLERS_AFTER_SCAN);
        await PromiseUtil.runPromisesSequentially(
            this,
            this.getControllerAdapters().map(current => {
                return () => current.handleContextAvailable();
            })
        );
        await this._runHookStorage(FrameworkHooksEnum.CONTROLLERS_READY);
    }

    /**
     * Finds the target hook storage by type if it doesn't exists creates it
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @param {FrameworkHooksEnum} hookType Type of hook
     * @returns {HookStorage} Existing hook storage or new one, if was not defined
     * @since 0.1.0
     * @memberof Lollipop
     */
    private _findOrCreateHookStorage(hookType: FrameworkHooksEnum): HookStorage {
        let targetHookStorage = this._frameworkHooks[hookType];
        if (!targetHookStorage) {
            targetHookStorage = new HookStorage();
            this._frameworkHooks[hookType] = targetHookStorage;
        }
        return targetHookStorage;
    }

    private async _runHookStorage(hookType: FrameworkHooksEnum): Promise<void> {
        await this._findOrCreateHookStorage(hookType).runAllHooks(this);
    }
}
