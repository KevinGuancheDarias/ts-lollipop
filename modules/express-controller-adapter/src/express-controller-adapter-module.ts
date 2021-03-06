import * as express from 'express';

import { ContextHolder } from '@ts-lollipop/core';
import { ModuleTypes } from '@ts-lollipop/core/dist/enums/module-types.enum';
import { AbstractControllerAdapterModule } from '@ts-lollipop/core/dist/adapters/controller/abstract-controller-adapter.module';
import { LollipopLogger } from '@ts-lollipop/core/dist/log';
import { ControllerAdapterConfiguration } from '@ts-lollipop/core/dist/adapters/controller/types/controller-adapter-configuration';
import { FrameworkHooksEnum } from '@ts-lollipop/core/dist/hook/enums/framework-hooks.enum';
import { LollipopResponse, RequestParamsMap, LollipopRequest } from '@ts-lollipop/core/dist/adapters/controller';
import { ExpressLollipopResponse } from './pojos/express-lollipop-response';
import { RequestBuilder } from '@ts-lollipop/core/dist/adapters/controller/builders/request.builder';

/**
 *
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class ExpressControllerAdapterModule
 * @since 0.1.0
 * @extends {AbstractControllerAdapterModule}
 */
export class ExpressControllerAdapterModule<T extends ControllerAdapterConfiguration = ControllerAdapterConfiguration>
    extends AbstractControllerAdapterModule<T> {

    private _log: LollipopLogger = new LollipopLogger(this.constructor);
    protected _express: express.Application;

    public constructor(settings: T, protected _expressInstance?: express.Application) {
        super(settings);
        if (_expressInstance) {
            this._express = _expressInstance;
        } else {
            this._express = express();
            this._express.use(express.urlencoded({ extended: true }));
            this._express.use(express.json());
        }
    }

    public getModuleType(): ModuleTypes {
        return ModuleTypes.CONTROLLER;
    }


    /**
     * Returns the used express instance
     *
     * @since 0.2.0
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {express.Application}
     * @memberof ExpressControllerAdapterModule
     */
    public getExpress(): express.Application {
        return this._express;
    }

    public async registerModule(): Promise<void> {
        await super.registerModule();
        ContextHolder.registerHooks({
            name: this.constructor.name,
            type: FrameworkHooksEnum.CONTEXT_READY,
            body: async () => {
                if (!this._expressInstance) {
                    await this._log.info(`Invoking express.listen in port ${this._settings.listenPort}`);
                    this._express.listen(this._settings.listenPort);
                }
            }
        });
    }

    public handleGetDecorator(path: string, target: Object, method: string): void {
        this._express.get(path, async (request, response) => {
            const lollipopRequest = this._createCommonRequestBuilder(request).getRequest();
            const lollipopResponse: LollipopResponse = new ExpressLollipopResponse(response);
            this._runFiltersAndHandleRequestResult(target, method, lollipopRequest, lollipopResponse, response);
        });
    }

    public handlePostDecorator(path: string, target: Object, method: string): void {
        this._express.post(path, async (request, response) => {
            const lollipopRequest = this._createCommonRequestBuilder(request)
                .withPostParams(request.body)
                .withJsonBody(JSON.stringify(request.body))
                .withParsedJson(request.body)
                .getRequest();
            const lollipopResponse: LollipopResponse = new ExpressLollipopResponse(response);
            this._runFiltersAndHandleRequestResult(target, method, lollipopRequest, lollipopResponse, response);
        });
    }

    public handlePutDecorator(path: string, target: Object, method: string): void {
        this._express.put(path, async (request, response) => {
            const lollipopRequest = this._createCommonRequestBuilder(request)
                .withPostParams(request.body)
                .withJsonBody(JSON.stringify(request.body))
                .withParsedJson(request.body)
                .getRequest();
            const lollipopResponse: LollipopResponse = new ExpressLollipopResponse(response);
            this._runFiltersAndHandleRequestResult(target, method, lollipopRequest, lollipopResponse, response);
        });
    }

    public handleDeleteDecorator(path: string, target: Object, method: string): void {
        this._express.delete(path, async (request, response) => {
            const lollipopRequest = this._createCommonRequestBuilder(request)
                .getRequest();
            const lollipopResponse: LollipopResponse = new ExpressLollipopResponse(response);
            this._runFiltersAndHandleRequestResult(target, method, lollipopRequest, lollipopResponse, response);
        });
    }

    protected _findGetParams(expressRequest: express.Request): RequestParamsMap {
        return expressRequest.query;
    }

    protected _findPathParams(expressRequest: express.Request): RequestParamsMap {
        return expressRequest.params;
    }

    protected _findHttpHeaders(expressRequest: express.Request): RequestParamsMap {
        return <any>expressRequest.headers;
    }

    /**
     * Creates a <i>RequestBuilder</i> with GET, PATH params and HTTP headers (commonly used in all HTTP methods)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @protected
     * @param {express.Request} expressRequest
     * @returns {RequestBuilder}
     * @memberof ExpressControllerAdapterModule
     */
    protected _createCommonRequestBuilder(expressRequest: express.Request): RequestBuilder {
        return RequestBuilder.build()
            .withControllerAdapter(this)
            .withGetParams(this._findGetParams(expressRequest))
            .withPathParams(this._findPathParams(expressRequest))
            .withHeaders(this._findHttpHeaders(expressRequest));
    }

    /**
     * Executes the filters, and sends the results to the browser <br>
     * Override it, to change the information sent to the browser by defining <i>action</i> argument,
     * see <i>DotControllerAdapterModule</i> for an example
     *
     * @since 0.1.0
     * @protected
     * @param target
     * @param method
     * @param lollipopRequest
     * @param lollipopResponse
     * @param {Function} [action] Action to execute
     */
    protected async _runFiltersAndHandleRequestResult(
        target: any,
        method: string,
        lollipopRequest: LollipopRequest,
        lollipopResponse: LollipopResponse,
        response: express.Response,
        action?: () => Promise<void>
    ): Promise<void> {
        await this._runFiltersAndFollow(target, method, lollipopRequest, lollipopResponse, async () => {
            if (action) {
                await action();
            }
            response.send(lollipopResponse.getBody());
        });

    }
}
