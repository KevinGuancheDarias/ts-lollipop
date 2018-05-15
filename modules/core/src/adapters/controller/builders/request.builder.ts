import { AbstractBuilder } from '../../../builders/abstract.builder';
import { RequestParamsMap, LollipopRequest } from '../pojos/lollipop-request';
import { BadInputLollipopError } from '../../../errors/bad-input-lollipop.error';
import { AbstractControllerAdapterModule } from '../abstract-controller-adapter.module';

/**
 * Creates a <i>Request</i>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class RequestBuilder
 * @extends {AbstractBuilder}
 */
export class RequestBuilder extends AbstractBuilder {
    private _request: LollipopRequest;

    public constructor() {
        super();
        this._request = new LollipopRequest();
    }

    public withGetParams(map: RequestParamsMap): this {
        this._request.setGetParams(map);
        return this;
    }

    public withPathParams(map: RequestParamsMap): this {
        this._request.setPathParams(map);
        return this;
    }

    public withPostParams(map: RequestParamsMap): this {
        this._request.setPostParams(map);
        return this;
    }

    public withHeaders(map: RequestParamsMap): this {
        this._request.setHeaders(map);
        return this;
    }

    public withDeleteParams(map: RequestParamsMap): this {
        this._request.setPathParams(map);
        return this;
    }

    public withJsonBody(body: string): this {
        this._request.setJsonBody(body);
        return this;
    }

    public withParsedJson(value: any): this {
        this._request.setParsedJson(value);
        return this;
    }

    /**
     * Parses the JSON body with JSON.stringify()
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {this}
     * @memberof RequestBuilder
     */
    public withSelfParsedJson(): this {
        const jsonBody: string = this._request.getJsonBody();
        if (jsonBody === null || typeof jsonBody === 'undefined') {
            throw new BadInputLollipopError(
                // tslint:disable-next-line:max-line-length
                'withSelfParsedJson() expects Request JSON body to be defined, if you have called withJsonBody() make sure it was called before withSelfParsedJson()'
            );
        }
        this.withParsedJson(JSON.stringify(jsonBody));
        return this;

    }

    /**
     * Defines the request as read only <br>
     * <b>Notice: </b> this must be the last builder method, for obvius reasons
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {this}
     * @memberof RequestBuilder
     */
    public withReadOnly(): this {
        this._request.defineAsReadOnly();
        return this;
    }

    /**
     * Defines the  controller adapter <br>
     * <b>NOTICE:</b> This is commonly done by framework internals
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {AbstractControllerAdapterModule} value
     * @returns {this}
     * @memberof RequestBuilder
     */
    public withControllerAdapter(value: AbstractControllerAdapterModule): this {
        this._request.setControllerAdapter(value);
        return this;
    }

    /**
     * Returns the generated Request object
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {LollipopRequest}
     * @memberof RequestBuilder
     */
    public getRequest(): LollipopRequest {
        return this._request;
    }
}
