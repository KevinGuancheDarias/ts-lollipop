// tslint:disable-next-line:max-line-length
import { AbstractControllerSecurityAdapter } from '@ts-lollipop/core/dist/adapters/controller-security';
import { RequestContext, LollipopRequest } from '@ts-lollipop/core/dist/adapters/controller';
import * as jwt from 'jsonwebtoken';
import { JwtControllerSecurityOptions } from './types/jwt-controller-security-options';

/**
 * Jwt Security adapter
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class JwtControllerSecurityAdapterModule
 * @extends {AbstractControllerSecurityAdapter}
 */
export class JwtControllerSecurityAdapterModule extends AbstractControllerSecurityAdapter {

    private static readonly BEARER_TEXT_LENGTH = 7;

    public constructor(protected _options: JwtControllerSecurityOptions) {
        super(_options);
        if (!this._options.tokenDuration) {
            this._options.tokenDuration = 1500;
        }
        if (!this._options.algo) {
            this._options.algo = 'HS256';
        }
    }

    /**
     * Creates a new token JWT token
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {*} tokenBody
     * @returns {string}
     * @memberof JwtControllerSecurityAdapterModule
     */
    public createToken(tokenBody: any): string {
        return jwt.sign(tokenBody, this._options.secret, {
            algorithm: this._options.algo,
            expiresIn: this._options.tokenDuration
        });
    }

    public supports(requestContext: RequestContext): boolean {
        const authorizationHeader: string = requestContext.request.getHeaders().authorization;
        return authorizationHeader && authorizationHeader.indexOf('Bearer ') !== -1;
    }

    public async createRequestSecurityObject(requestContext: RequestContext): Promise<string | object> {
        try {
            return this._verifyToken(requestContext);
        } catch (e) {
            console.warn(`Couldn't get valid token ${e.message}`);
        }
    }

    public isAuthenticated(requestContext: RequestContext): boolean {
        let retVal;
        try {
            this._verifyToken(requestContext);
            retVal = true;
        } catch (e) {
            retVal = false;
        }
        return retVal;
    }

    private _extractTokenFromHttpHeader(request: LollipopRequest): string {
        return request.getHeaders().authorization.substr(JwtControllerSecurityAdapterModule.BEARER_TEXT_LENGTH);
    }

    private _verifyToken(requestContext: RequestContext): string | object {
        return jwt.verify(this._extractTokenFromHttpHeader(requestContext.request), this._options.secret, {
            algorithms: [this._options.algo]
        });
    }
}
