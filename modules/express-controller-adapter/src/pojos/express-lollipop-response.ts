import { Response } from 'express';
import { LollipopResponse } from '@ts-lollipop/core/dist/adapters/controller';

/**
 * Express implementation of <i>LollipopResponse</i>
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class ExpressLollipopResponse
 * @since 0.1.0
 * @implements {LollipopResponse}
 */
export class ExpressLollipopResponse implements LollipopResponse {
    private _body: any;

    public constructor(private _expressResponse: Response) {

    }

    public setHeader(name: string, value: string): this {
        this._expressResponse.setHeader(name, value);
        return this;
    }

    public setHttpStatus(status: number, text?: string): this {
        this._expressResponse.status(status);
        if (text) {
            this._expressResponse.statusMessage = text;
        }
        return this;
    }

    public getBody(): any {
        return this._body;
    }

    public setBody(content: any): this {
        this._body = content;
        return this;
    }
}
