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

export class ExpressControllerAdapterModule extends AbstractControllerAdapterModule {

    private _log: LollipopLogger = new LollipopLogger(this.constructor);
    private _express: express.Application;

    public constructor(settings: ControllerAdapterConfiguration) {
        super(settings);
        this._express = express();
        this._express.use(express.urlencoded({ extended: true }));
        this._express.use(express.json());
    }

    public getModuleType(): ModuleTypes {
        return ModuleTypes.CONTROLLER;
    }

    public async registerModule(): Promise<void> {
        await super.registerModule();
        ContextHolder.registerHooks({
            name: this.constructor.name,
            type: FrameworkHooksEnum.CONTEXT_READY,
            body: async () => {
                await this._log.info(`Invoking express.listen in port ${this._settings.listenPort}`);
                this._express.listen(this._settings.listenPort);
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

    private _findGetParams(expressRequest: express.Request): RequestParamsMap {
        return expressRequest.query;
    }

    private _findPathParams(expressRequest: express.Request): RequestParamsMap {
        return expressRequest.params;
    }

    private _findHttpHeaders(expressRequest: express.Request): RequestParamsMap {
        return <any>expressRequest.headers;
    }

    /**
     * Creates a <i>RequestBuilder</i> with GET, PATH params and HTTP headers (commonly used in all HTTP methods)
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @private
     * @param {express.Request} expressRequest
     * @returns {RequestBuilder}
     * @memberof ExpressControllerAdapterModule
     */
    private _createCommonRequestBuilder(expressRequest: express.Request): RequestBuilder {
        return RequestBuilder.build()
            .withControllerAdapter(this)
            .withGetParams(this._findGetParams(expressRequest))
            .withPathParams(this._findPathParams(expressRequest))
            .withHeaders(this._findHttpHeaders(expressRequest));
    }

    private async _runFiltersAndHandleRequestResult(
        target: any,
        method: string,
        lollipopRequest: LollipopRequest,
        lollipopResponse: LollipopResponse,
        response: express.Response
    ): Promise<void> {
        this._runFiltersAndFollow(target, method, lollipopRequest, lollipopResponse, async () => {
            response.send(lollipopResponse.getBody());
        });

    }

}
