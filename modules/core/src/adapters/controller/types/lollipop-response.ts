/**
 * Represents a response object
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @since 0.1.0
 * @interface LollipopResponse
 */
export interface LollipopResponse {
    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {string} name
     * @param {string} value
     * @returns {this}
     * @since 0.1.0
     * @memberof LollipopResponse
     */
    setHeader(name: string, value: string): this;

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {number} status
     * @param {string} [text]
     * @returns {this}
     * @since 0.1.0
     * @memberof LollipopResponse
     */
    setHttpStatus(status: number, text?: string): this;

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {*}
     * @since 0.1.0
     * @memberof LollipopResponse
     */
    getBody(): any;

    /**
     *
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @param {*} content
     * @returns {this}
     * @since 0.1.0
     * @memberof LollipopResponse
     */
    setBody(content: any): this;
}
