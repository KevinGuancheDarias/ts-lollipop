// tslint:disable-next-line:max-line-length
import { Controller, LollipopRequest, LollipopResponse, Get, Post, Produces, MediaTypeEnum } from '@ts-lollipop/core/dist/adapters/controller';
import { SecurityModule, Security } from '@ts-lollipop/core/dist/adapters/controller-security';
import { JwtControllerSecurityAdapterModule } from '@ts-lollipop/jwt-controller-security-adapter';

@Controller('/security')
export class LoginController {

    private static readonly VALID_USER = 'kevin';
    private static readonly VALID_PASSWORD = '1234';

    @SecurityModule()
    private _jwtSecurity: JwtControllerSecurityAdapterModule;

    @Post('login')
    @Security.excludeMethod()
    public login(request: LollipopRequest, response: LollipopResponse): string {
        const postVars = request.getParsedJson();
        if (postVars.username === LoginController.VALID_USER && postVars.password === LoginController.VALID_PASSWORD) {
            return this._jwtSecurity.createToken({
                id: 1,
                username: postVars.username,
                email: 'some@some.com'
            });
        } else {
            response.setHttpStatus(401, 'Bad Credentials');
            return 'Bad Credentials';
        }
    }

    @Get('me')
    @Security.forMethod()
    @Produces(MediaTypeEnum.JSON)
    public me(request: LollipopRequest) {
        const user = request.getAuthenticationMetadata<any>();
        return {
            id: user.id,
            username: user.username,
            email: user.email
        };
    }
}
