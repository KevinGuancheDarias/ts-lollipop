import { LollipopError } from './lollipop.error';

export class ReadOnlyLollipopError extends LollipopError {
    public constructor(message = 'Tried to set a readonly property') {
        super(message);
    }
}
