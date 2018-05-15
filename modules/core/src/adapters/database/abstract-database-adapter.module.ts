import { AbstractLollipopModule } from '../../abstract-lollipop-module';
import { ModuleTypes } from '../../enums/module-types.enum';
import { LollipopLogger } from '../../log/lollipop-logger';
import { ContextHolder } from '../../context-holder';
import { FrameworkHooksEnum } from '../../hook/enums/framework-hooks.enum';
import { LOLLIPOP_CONNECTION_COMPONENT_IDENTIFIER } from './decorators/database-connection.decorator';

export interface LollipopDatabaseModuleConstructor {
    new(): AbstractDatabaseAdapterModule;
}

/**
 * Class to be extended in order to implement database related module
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class AbstractDatabaseAdapterModule
 * @extends {AbstractLollipopModule}
 */
export abstract class AbstractDatabaseAdapterModule extends AbstractLollipopModule {
    private _defaultImpLog: LollipopLogger = new LollipopLogger(this.constructor);

    public abstract setupConnection(): Promise<void>;
    public abstract getConnection(): any;

    public constructor(options: any) {
        super();
        this._defaultImpLog.debug('Options passed are', options);
    }

    public getModuleType(): ModuleTypes {
        return ModuleTypes.DATABASE;
    }

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
