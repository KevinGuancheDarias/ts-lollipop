import {
    Controller,
    Get
} from '@ts-lollipop/core/dist/adapters/controller';
import { Security } from '@ts-lollipop/core/dist/adapters/controller-security';
import { ViewInformation } from '@ts-lollipop/core/dist/adapters/controller/pojos/view-information';

/**
 * It's the default controller
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class DefaultController
 */
@Controller()
@Security.excludeClass()
export class DefaultController {

    @Get('')
    public sayHello(): ViewInformation {
        return new ViewInformation('hello', {
            name: 'Kevin',
            number: 93
        });
    }
}
