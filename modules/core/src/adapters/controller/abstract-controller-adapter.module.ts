import { AbstractLollipopModule } from '../../abstract-lollipop-module';
import { RouteConfig } from './types/route-config';
import { BadInputLollipopError } from '../../errors/bad-input-lollipop.error';
import { ControllerAdapterConfiguration } from './types/controller-adapter-configuration';
import { MetadataUtil } from '../../utils/metadata.util';
import { ContextHolder } from '../../context-holder';
import { LollipopLogger } from '../../log/lollipop-logger';
import { SerializerFunction } from './types/serializer-function';
import { MediaTypeEnum } from './enums/media-type.enum';
import { RequestContext } from './types/request-context';
import { findProducesValue } from './decorators/produces.decorator';
import { ModuleTypes } from '../../enums/module-types.enum';
import { AbstractControllerSecurityAdapter } from '../controller-security/abstract-controller-security-adapter.module';
import { RequestFilter, EMPTY_REQUEST_FILTER } from './types/request-filter';
import { LollipopRequest } from './pojos/lollipop-request';
import { LollipopResponse } from './types/lollipop-response';
import { DiLollipopModule } from '../../di/di-lollipop.module';
import { DiContainer } from '../../di/di-container';

/**
 * Represents a controller
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @abstract
 * @class AbstractControllerModule
 * @since 0.1.0
 * @extends {AbstractLollipopModule}
 */
export abstract class AbstractControllerAdapterModule extends AbstractLollipopModule {

    /**
     * Registered serializers
     *
     * @protected
     * @type {{ [key: number]: SerializerFunction }}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected _producerSerializers: { [key: number]: SerializerFunction } = {};

    /**
     * Has the detected controllers
     *
     * @protected
     * @type {any[]}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected _controllers: any[] = [];

    private _defaultImpLog: LollipopLogger = new LollipopLogger(this.constructor);

    public constructor(protected _settings: ControllerAdapterConfiguration) {
        super();
        if (!this._settings.securityAdapters) {
            this._settings.securityAdapters = [];
        } else {
            this._settings.securityAdapters.forEach(current => current.setControllerAdapter(this));
        }
        if (!this._settings.beforeAuthRequestFilters) {
            this._settings.beforeAuthRequestFilters = [EMPTY_REQUEST_FILTER];
        }
        if (!this._settings.afterAuthRequestFilters) {
            this._settings.afterAuthRequestFilters = [EMPTY_REQUEST_FILTER];
        }

        this._registerCommonSerializers();
    }


    /**
     * Action to execute at decoration time for decorator <i>Get</i>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {string} path Target path
     * @param {Object} target Object that has the decorator
     * @param {string} method Method that has the decorator
     * @since 0.1.0
     * @memberof AbstractControllerModule
     */
    public abstract handleGetDecorator(path: string, target: Object, method: string): void;

    /**
     * Action to execute at decoration time for decorator <i>Post</i>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {string} path Target path
     * @param {Object} target Object that has the decorator
     * @param {string} method Method that has the decorator
     * @since 0.1.0
     * @memberof AbstractControllerModule
     */
    public abstract handlePostDecorator(path: string, target: Object, method: string): void;

    /**
     * Action to execute at decoration time for decorator <i>Put</i>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {string} path Target path
     * @param {Object} target Object that has the decorator
     * @param {string} method Method that has the decorator
     * @since 0.1.0
     * @memberof AbstractControllerModule
     */
    public abstract handlePutDecorator(path: string, target: Object, method: string): void;

    /**
     * Action to execute at decoration time for decorator <i>Delete</i>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @abstract
     * @param {string} path Target path
     * @param {Object} target Object that has the decorator
     * @param {string} method Method that has the decorator
     * @since 0.1.0
     * @memberof AbstractControllerModule
     */
    public abstract handleDeleteDecorator(path: string, target: Object, method: string): void;

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {AbstractControllerSecurityAdapter[]}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    public getSecurityModules(): AbstractControllerSecurityAdapter[] {
        return this._settings.securityAdapters;
    }

    /**
     * Registers the controller if it doesn't exists in the controllers array <br>
     * <b>NOTICE: </b> Usually invoked by the method decorators
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {Object} target Target controller instance to register
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    public registerController(target: Object) {
        if (!this._controllers.find(current => target === current)) {
            this._controllers.push(target);
        }
    }

    /**
     * Action to execute at decoration time for decorator <i>Controller</i>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {Object} target Object that has the decorator
     * @since 0.1.0
     * @memberof AbstractControllerModule
     */
    public handleControllerDecorator(target: Function): void {
        console.log('doing nothing with ' + target.name);
    }

    /**
     * Default implementation ensures all controllers has been imported <br>
     * require()' files, is enough to ensure class level decorators are triggered
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {Promise<void>} Resolves when all the controllers have been "require()d"
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    public async registerModule(): Promise<void> {

    }

    public async scanControllers(): Promise<void> {
        await this._defaultImpLog.debug('As context is available, is a good time to scan @Controller decorators');
        (await MetadataUtil.findAllTypescriptSourceFiles(this._settings.directories)).forEach(file => require(file));
    }

    /**
     * Actions to execute when the context is available
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    public async handleContextAvailable(): Promise<void> {
        this._triggerInjects();
    }

    /**
     * Action to execute at decoration time for decorator <i>Route</i> <br>
     * <b>Notice: </b> Has default implementation
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {RouteConfig} routeConfig Configuration of the route
     * @param {Object} target Object that has the decorator
     * @param {string} method Method that has the decorator
     * @memberof AbstractControllerModule
     */
    public handleRouteDecorator(routeConfig: RouteConfig, target: Object, method: string): void {
        if (!routeConfig.get && !routeConfig.post && !routeConfig.put && !routeConfig.delete) {
            throw new BadInputLollipopError('@Route decorator expects at least one http method to be true');
        }
        if (routeConfig.get) {
            this.handleGetDecorator(routeConfig.path, target, method);
        }
        if (routeConfig.post) {
            this.handlePostDecorator(routeConfig.path, target, method);
        }
        if (routeConfig.put) {
            this.handlePutDecorator(routeConfig.path, target, method);
        }
        if (routeConfig.delete) {
            this.handleDeleteDecorator(routeConfig.path, target, method);
        }
    }

    /**
     * Registers a serializer, that should be fired when <i>MediaTypeEnum</i> matches <i>@Produces</i>
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {MediaTypeEnum} mediaType
     * @param {SerializerFunction} serializer
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    public registerProducerSerializer(mediaType: MediaTypeEnum, serializer: SerializerFunction): void {
        this._producerSerializers[mediaType] = serializer;
    }

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {MediaTypeEnum} mediaTypeEnum
     * @param {RequestContext} context
     * @returns {Promise<any>}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    public async invokeProducerSerializer(mediaTypeEnum: MediaTypeEnum, context: RequestContext): Promise<any> {
        await this._producerSerializers[mediaTypeEnum](context);
    }

    /**
     * Returns the serializer  function for given target and method (detected by <i>@Produces</i> decorator value)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {Object} target
     * @param {string} method
     * @returns {SerializerFunction}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected _findSerializer(target: Object, method: string): SerializerFunction {
        const targetMediaType: MediaTypeEnum = findProducesValue<any>(target, method) || MediaTypeEnum.NONE;
        return this._producerSerializers[targetMediaType];
    }

    /**
     * Gets the container from the DI module
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @returns {DiContainer} DI container, or null if not found
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected _findDiContainer(): DiContainer {
        const diModules: DiLollipopModule[] = ContextHolder.getLollipop().getRegisteredModulesByType<DiLollipopModule>(ModuleTypes.DI);
        if (diModules.length > 1) {
            this._defaultImpLog.warn('There is more than one DI module, unexpected behaviors may occur, will use only first module');
        }

        const diModule: DiLollipopModule = diModules[0];
        if (!diModule) {
            return null;
        } else {
            return diModule.getContainer() || null;
        }
    }

    /**
     * Returns all the security filters
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {*} target
     * @param {string} method
     * @returns {RequestFilter[]}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected _findSecurityFilters(target: any, method: string): RequestFilter[] {
        return this.getSecurityModules().map(current => current.findMethodSecurityFilter(target, method));
    }

    /**
     * Executes all request filters <br>
     * Ideally would be called when we have populated the <i>LollipopRequest</i> and the <i>LollipopResponse</i>
     * but before invoking controller method
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {LollipopRequest} request
     * @param {LollipopResponse} response
     * @param {RequestFilter} securityFilters
     * @returns {Promise<boolean>} True, if should call the controller method
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected async _runRequestFilters(
        request: LollipopRequest,
        response: LollipopResponse,
        securityFilters: RequestFilter[]
    ): Promise<boolean> {
        const promiseFunctions: Function[] = [
            ...this._settings.beforeAuthRequestFilters.map(current => () => current.body({ request, response })),
            ...securityFilters.map(current => () => current.body({ request, response })),
            ...this._settings.afterAuthRequestFilters.map(current => () => current.body({ request, response })),
        ];
        let retVal: boolean;
        for (const currentPromiseFunction of promiseFunctions) {
            retVal = await currentPromiseFunction(request, response);
            if (!retVal) {
                break;
            }
        }
        return retVal;
    }

    /**
     * Runs Lollipop filter-chain, and follows the executon
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {*} target
     * @param {string} method
     * @param {LollipopRequest} lollipopRequest
     * @param {LollipopResponse} lollipopResponse
     * @param {(retvalFromController: any) => Promise<void>} followAction Method invoked, when the controller method is invoked
     * @returns {Promise<void>}
     * @since 0.1.0
     * @memberof AbstractControllerAdapterModule
     */
    protected async _runFiltersAndFollow(
        target: any,
        method: string,
        lollipopRequest: LollipopRequest,
        lollipopResponse: LollipopResponse,
        followAction: (retvalFromController: any) => Promise<void>
    ): Promise<void> {
        const doContinue = await this._runRequestFilters(lollipopRequest, lollipopResponse, this._findSecurityFilters(target, method));
        const result = doContinue
            ? await target[method].apply(target, [
                lollipopRequest,
                lollipopResponse
            ])
            : null;
        if (result !== null && typeof result !== 'undefined') {
            lollipopResponse.setBody(result);
        }
        const serializer = this._findSerializer(target, method);
        serializer({
            request: lollipopRequest,
            response: lollipopResponse
        });
        lollipopRequest.defineAsReadOnly();
        await followAction(result);
    }

    private _registerCommonSerializers(): void {
        this.registerProducerSerializer(MediaTypeEnum.NONE, async context => {
            this._defaultImpLog.debug(`Using no serializer for request ${context.request.getPath()}`);
        });
        this.registerProducerSerializer(MediaTypeEnum.JSON, async context => {
            context.response.setHeader('Content-Type', 'application/json;Charset=UTF-8');
            context.response.setBody(JSON.stringify(context.response.getBody()));
        });
        this.registerProducerSerializer(MediaTypeEnum.TEXT, async context => {
            context.response.setHeader('Content-Type', 'text/plain;Charset=UTF-8');
        });
        this.registerProducerSerializer(MediaTypeEnum.HTML, async context => {
            context.response.setHeader('Content-Type', 'text/html;Charset=UTF-8');
        });
    }

    private _triggerInjects(): void {
        const container = this._findDiContainer();
        if (container) {
            this._controllers.forEach(current => {
                container.injectInto(current);
            });
        }
    }
}
