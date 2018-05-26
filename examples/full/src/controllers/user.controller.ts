import { Controller, Get, Produces, MediaTypeEnum, LollipopRequest } from '@ts-lollipop/core/dist/adapters/controller';
import { Security } from '@ts-lollipop/core/dist/adapters/controller-security';

@Controller('/user')
@Security.forClass()
export class UserController {

    private static _findLoggedInUserInfo(request: LollipopRequest): any {
        const user = request.getAuthenticationMetadata<any>();
        return {
            id: user.id,
            username: user.username,
            email: user.email
        };
    }

    @Get('me')
    @Produces(MediaTypeEnum.JSON)
    public me(request: LollipopRequest) {
        return UserController._findLoggedInUserInfo(request);
    }

    @Get('noKevin')
    @Produces(MediaTypeEnum.JSON)
    @Security.forMethod({
        customValidation: async requestContext => {
            const user = UserController._findLoggedInUserInfo(requestContext.request);
            return user.username !== 'kevin';
        }
    })
    public noKevin(request: LollipopRequest) {
        return UserController._findLoggedInUserInfo(request);
    }
}
