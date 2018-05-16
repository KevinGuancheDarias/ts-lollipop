import { AbstractLollipopModule } from '../../abstract-lollipop-module';
import { ModuleTypes } from '../../enums/module-types.enum';
import { LollipopLogger } from '../../log/lollipop-logger';
import { ContextHolder } from '../../context-holder';
import { FrameworkHooksEnum } from '../../hook/enums/framework-hooks.enum';
import { LOLLIPOP_CONNECTION_COMPONENT_IDENTIFIER } from './decorators/database-connection.decorator';

/**
 *
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface LollipopDatabaseModuleConstructor
 */
export interface LollipopDatabaseModuleConstructor {
    new(): AbstractDatabaseAdapterModule;
}

/**
 * Class to be extended in order to implement database related module
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class AbstractDatabaseAdapterModule
 * @since 0.1.0
 * @extends {AbstractLollipopModule}
 */
export abstract class AbstractDatabaseAdapterModule extends AbstractLollipopModule {
    private _defaultImpLog: LollipopLogger = new LollipopLogger(this.constructor);

    /**
     * Executes the logic require to setup the connection
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @returns {Promise<void>} Should resolve when the connection has been setup with success
     * @since 0.1.0
     * @memberof AbstractDatabaseAdapterModule
     */
    public abstract setupConnection(): Promise<void>;

    /**
     * Returns the connection
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @returns {*}
     * @since 0.1.0
     * @memberof AbstractDatabaseAdapterModule
     */
    public abstract getConnection(): any;

    public constructor(options: any) {
        super();
        this._defaultImpLog.debug('Options passed are', options);
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {ModuleTypes}
     * @since 0.1.0
     * @memberof AbstractDatabaseAdapterModule
     */
    public getModuleType(): ModuleTypes {
        return ModuleTypes.DATABASE;
    }

    /**
     * Registers the component <br>
     * <b>IMPORTANT: Children classes, should invoke super, to ensure @DatabaseConnection decorator works</b>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof AbstractDatabaseAdapterModule
     */
    public async registerModule(): Promise<void> {
        ContextHolder.registerHooks({
            type: FrameworkHooksEnum.DI_AFTER_COMPONENT_SCAN,
            name:
                `${this.constructor.name} Register database connection as qualified component ${LOLLIPOP_CONNECTION_COMPONENT_IDENTIFIER}`,
            body: () => {
                ContextHolder
                    .getDiModule()
                    .getContainer()
                    .registerInstancedComponent(this.getConnection(), LOLLIPOP_CONNECTION_COMPONENT_IDENTIFIER);
            }
        });
    }

}
