import { ControllerSecurityOptions } from '@ts-lollipop/core/dist/adapters/controller-security/types/controller-security-options';

export type SupportedAlgos = 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512' | 'ES256' | 'ES384' | 'ES512';

/**
 * Options for JWControllerSecurityAdapter
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface JwtControllerSecurityOptions
 * @since 0.1.0
 * @extends {ControllerSecurityOptions}
 */
export interface JwtControllerSecurityOptions extends ControllerSecurityOptions {

    /**
     * Secret used to generate/validate the JWT token
     *
     * @type {string}
     * @since 0.1.0
     * @memberof JwtControllerSecurityOptions
     */
    secret: string;

    /**
     * Token duration (in seconds), Defaults to 1500 (30min)
     *
     * @type {number}
     * @since 0.1.0
     * @memberof JwtControllerSecurityOptions
     */
    tokenDuration?: number;

    /**
     * Algorithm used with the JWT token, Defaults to HS256
     *
     * @type {SupportedAlgos}
     * @since 0.1.0
     * @memberof JwtControllerSecurityOptions
     */
    algo?: SupportedAlgos;
}
