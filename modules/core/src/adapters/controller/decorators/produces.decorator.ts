import 'reflect-metadata';

import { MediaTypeEnum } from '../enums/media-type.enum';

const PRODUCES_METADATA_PROPERTY = 'Produces';

/**
 * Gets the value of the <i>@Produces</i> decorator for given object & method
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @template T
 * @param {T} target Destination object
 * @param {keyof T} method Method that has the decorator
 * @returns {MediaTypeEnum}
 * @since 0.1.0
 */
export function findProducesValue<T>(target: T, method: keyof T): MediaTypeEnum {
    return Reflect.getMetadata(PRODUCES_METADATA_PROPERTY, target, method);
}

/**
 * Executes a serializer to convert the output <br>
 * For example: You can convert to JSON, usually the serializer adds the HTTP Content-Type header
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @param {MediaTypeEnum} mediaType MediaType to use
 * @returns {MethodDecorator}
 * @since 0.1.0
 */
export function Produces(mediaType: MediaTypeEnum): MethodDecorator {
    return (target, method: string | symbol) => {
        Reflect.defineMetadata(PRODUCES_METADATA_PROPERTY, mediaType, target, method);
    };
}
