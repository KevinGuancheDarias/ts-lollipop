import { GenericObject } from '../types/generic-object';

/**
 * When using a ControllerAdapter that uses "views" to render the result, this interface is usually required
 *
 * @since 0.2.0
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class ViewInformation
 */
export class ViewInformation {

    public constructor(private _filename: string, private _viewParams: GenericObject = {}) {

    }

    public getFilename(): string {
        return this._filename;
    }


    /**
     * Returns a <b>clone</b> of the passed viewParams
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @returns {GenericObject}
     * @memberof ViewInformation
     */
    public getViewParams(): GenericObject {
        return { ...this._viewParams };
    }
}
