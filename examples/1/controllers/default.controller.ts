import { LoginComponent } from '../components/login.component';
import { Connection } from 'typeorm';
import { Category } from '../entities/category';
import {
    Controller,
    Get,
    Produces,
    MediaTypeEnum,
    LollipopRequest,
    Post,
    Put,
    Delete,
    LollipopResponse
} from '@ts-lollipop/core/dist/adapters/controller';
import { Security } from '@ts-lollipop/core/dist/adapters/controller-security';
import { Inject, DatabaseConnection } from '@ts-lollipop/core';

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

    @Inject()
    private _loginComponent: LoginComponent;

    @DatabaseConnection()
    private _connection: Connection;

    @Get('')
    public sayHello(): string {
        return 'Hello Lollipop';
    }

    @Get('nameByGetParam')
    @Security.forMethod()
    public sayName(request: LollipopRequest): string {
        return `Name is: ${request.getGetParams().name}`;
    }

    @Get('post/:slug')
    public sayNameByPathParam(request: LollipopRequest): string {
        return `By post slug is: ${request.getPathParams().slug}`;
    }

    @Get('displayHeaders')
    public displayHeaders(request: LollipopRequest): string {
        return JSON.stringify(request.getHeaders());
    }

    @Get('produceJson')
    @Produces(MediaTypeEnum.JSON)
    public produceJson(): Object {
        return {
            name: 'Kevin',
            loginData: this._loginComponent.some,
            id: -1
        };
    }

    @Get('databaseData')
    @Produces(MediaTypeEnum.JSON)
    public async databaseData() {
        return await this._connection.getRepository(Category).find();
    }

    @Get('notFound')
    public displayNotFound(_request: LollipopRequest = null, response: LollipopResponse): void {
        response.setHttpStatus(404);
    }

    @Post('getPostParams')
    public displayPost(request: LollipopRequest): string {
        return JSON.stringify(request.getPostParams());
    }

    @Put('getPutAsJson')
    public displayPut(request: LollipopRequest): string {
        return JSON.stringify(request.getParsedJson());
    }

    @Delete('delete/:userId')
    public deleteUser(request: LollipopRequest): string {
        return `Deleting user ${request.getPathParams().userId}`;
    }
}
