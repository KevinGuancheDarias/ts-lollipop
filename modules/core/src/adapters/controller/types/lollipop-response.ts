/**
 * Represents a response object
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @interface LollipopResponse
 */
export interface LollipopResponse {
    setHeader(name: string, value: string): this;
    setHttpStatus(status: number, text?: string): this;
    getBody(): any;
    setBody(content: any): this;
}
