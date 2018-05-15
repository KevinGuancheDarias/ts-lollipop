import { ControllerSecurityOptions } from '@ts-lollipop/core/dist/adapters/controller-security/types/controller-security-options';

export type SupportedAlgos = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512';

export interface JwtControllerSecurityOptions extends ControllerSecurityOptions {

    /**
     * Secret used to generate/validate the JWT token
     *
     * @type {string}
     * @memberof JwtControllerSecurityOptions
     */
    secret: string;

    /**
     * Token duration (in seconds), Defaults to 1500 (30min)
     *
     * @type {number}
     * @memberof JwtControllerSecurityOptions
     */
    tokenDuration?: number;

    /**
     * Algorithm used with the JWT token, Defaults to HS256
     *
     * @type {SupportedAlgos}
     * @memberof JwtControllerSecurityOptions
     */
    algo?: SupportedAlgos;
}
