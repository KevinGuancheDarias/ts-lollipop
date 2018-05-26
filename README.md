Lollipop framework
====================

Lollipop is a framework to write fast, clean, and easy to maintain NodeJS applications written in Typescript

# Requirements

* Node >= 8

# Features

* DI using decorators, just define where are the *Components* in the applications, and the DI does the rest. By default **project-root/src/components** , 
* Create REST controllers by using decorators, just define port to use (defaults to 7474), and path to Controllers, by default **project-root/src/controllers**
* Add security to *Controllers* using decorators, having default option to force all controllers to be secured and exclude only some (for example login one)
* Get database connection from inside *Services* , in the future the idea is to allow setting all database information without depending in the underlying implementation, for know we recommend using TypeOrm, which is a promising Typescript decorator based ORM
* "Adapters concept", change the implementation without having to learn too much new things, for example: if someone from the framework core, or outside creates a new HandlebarsAdapterModule, that is built in top of *ExpressAdapterModule* to instead of returning JSON, return mustache views, you would not have to learn new framework concepts, just use the decorators you already know, and write the Handlebars code

# Getting started

## Creating a project

In order to create an empty ready to use project, you may want to install the CLI, execute the following command `$ npm install -g @ts-lollipop/cli`, after the cli is installed you can run `$ lollipop new project_name`


## Launching the project

If you are using Visual Studio Code, It's as easy as executing F5 if you opened the project folder, to launch in a shell, first cd into *src* folder and then run: `$ TS_NODE_PROJECT=../tsconfig.json node --nolazy -r ts-node/register main.ts`

## Addings Services

Creating services is as easy as creating a new class in the `./components` folder, with a `@Component` decorator

```typescript
@Component()
class LoginComponent {

}
```

## Injecting one service into another

To use a service instance inside other service, you will want to use the `@Inject` decorator in a property of the original 
service, for example, if you want to inject **SettingsComponent** into **LogicComponent**, you would write the following code:

```typescript

@Component()
class LogicComponent {
    @Inject()
    private _settingsComponent: SettingsComponent;
}

```

## Doing service initialization logic after all the dependencies has been injected

You can do some logic to initialize a service using `@PostInject` decorator, please note that in Lollipop all services act as singleton, (no more than one instance is created), if we continue with the example of **SettingsComponent** and **LogicComponent**`, the code would look like this

```typescript

@Component()
class LogicComponent {
    @Inject()
    private _settingsComponent: SettingsComponent;

    private _appCode;

    @PostInject()
    public init(): Promise<void> {
        this._appCode = await this._settingsComponent.findSetting('APP_CODE');
    }
}

```

## Getting database connection in a service

After you have configured your **LollipopDatabaseAdapterModule**, which is usually **TypeOrmDatabaseAdapterModule** in the settings, usually configured automatically for you, in your project, if you used `@ts-lollipop/cli` to create your project, after setting it up, you can use the `@DatabaseConnection` in any *Component* or *Controller* (not recommend in controllers), to get the database connection, for example:

```typescript

@Component()
export class CategoryComponent {

    @DatabaseConnection()
    private _connection: Connection;

    private _repository: Repository<Category>;

    @PostInject()
    public async initDb(): Promise<void> {
        this._repository = this._connection.getRepository(Category);
        const dbCategories = await this.findAll();
        if (!dbCategories.length) {
            await this._createDefaultCategories();
        }
    }
}
```

Please, read about [TypeORM](https://github.com/typeorm/typeorm "TypeORM's Github page") to learn how to create entities (using decorators)  and how to use repositories

## Creating controllers

Controllers are used to handle HTTP request, `ExpressControllerAdapterModule` shipped with Lollipop is intended to be used for creating API rest

### Creating a controller

In your `./controllers` folder create a class with the `@Controller` decorator, you may add a prefix, but it's an optional param

```typescript
@Controller('/category')
class CategoryController {

}
```

### Defining routes for HTTP methods

Lollipop includes one decorator for each of the commonly used HTTP methods, `@Get`, `@Post`,`@Put`,`@Delete`, to create a route, just write the decorator above the method definition, for example

```typescript
@Controller('/category')
class CategoryController {

    @Inject()
    private _categoryComponent: CategoryComponent;

    @Get('')
    public returnRootAsNotFound(_, response: LollipopResponse): void {
        response.setHttpStatus(404);
    }

    @Post('')
    @Put('')
    public async save(request: LollipopRequest): Promise<any> {
        return await this._categoryComponent.save(request.getParsedJson());
    }

    @Delete(':id')
    public async delete(request: LollipopRequest): Promise<void> {
        return await this._categoryComponent.delete(request.getGetParams().id);
    }
}
```
The code above would listen to the following http request
* GET /category ==> **Returns 404**
* POST /category ==> executes save()
* PUT /category ==> executes save() too
* DELETE /category/4 ==> executes delete()

### Defining return type of HTTP response

Lollipop provides the `@Produces` decorator, which can be used to define the content to be returned to the web browser, the most used could be `@Produces(MediaTypeEnum.JSON)`, which converts to JSON the returned Object from controller, and tells the browser that we are sending JSON

```typescript

@Controller()
class SomeController {
    @Get('produceJson')
    @Produces(MediaTypeEnum.JSON)
    public produceJson(): Object {
        return {
            name: 'Kevin',
            loginData: this._loginComponent.some,
            id: -1
        };
    }
}
```

## Let's speak about security

By default the project created with `@ts-lollipop/cli` includes the `JwtControllerSecurityAdapterModule`, and has the `checkAll` option defined, which means that all @Controllers are going to be secure, unless excluded explicitly

### Excluding a @Controller class from security

To exclude an entire class, you can decorate the class with `@Security.excludeClass()`, for example

```typescript
@Controller()
@Security.excludeClass()
class PublicController {

}
```

### Excluding a method

To exclude a single method, you have to use `@Security.excludeMethod()`. Example:

```typescript
@Controller('category')
@Security.forClass() // Not necessary if security module option checkAll is true (default in projects generated with CLI)
class CategoryController {

    @Get('all')
    @Security.excludeMethod()
    public findAll(): void {
        // ...
    }

    @Post('')
    @Put('')
    public save(): void {
        // ...
    }
}
```

## Securing an entire class

Just define the `@Security.forClass()` decorator, check the code above

## Securing a single method of an excluded class

To secure a method, you can use the `@Security.forMethod()` decorator, see the following example: 

```typescript
@Controller('/api')
@Security.excludeClass()
class PublicApiController {
    @Get('publicThing')
    public publicThing(): void {
        // ...
    }

    @Post('killEveryone')
    @Security.forMethod()
    public deleteWorld(): void {

    }
}
```

## Login in the application

Lollipop provides the `@SecurityModule` which allows access to the security module from the controller. You can use it to handle module login logic, for example, with the `JwtControllerSecurityAdapterModule` you could do the following to return valid JWT tokens, for a later use of them for authentication. 
Example of login implementation:

```typescript
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
}
```

To login using the code above send a post request to URL  **/security/login** using following JSON 

```json
{
    "username": "kevin",
    "password": "1234"
}
```

### Defining a custom security validation method for a class

In lollipop you can add logic to validate the security of the logged user, for example with roles. In the next example, we are going to disallow access to the `AdminCategoriesController` for users that don't have the "Admin" role

```typescript
@Controller({
    
})
@Security.forClass({
    customValidation: async requestContext => {
        const user = context.request.getAuthenticationMetadata<any>();
        return user.role === 'admin';
    }
})
class AdminCategoriesController {

}
```

Please note that you can apply this on methods too... Example: ` @Security.forMethod({ customValidation: ...})`

# Hacking into the framework

## Creating RequestFilter

During the request, you can execute code before or after the authentication, but always before the Controller's method is invoked... good.. but, **what the heck is a RequestFilter?** RequestFilter is a function defined to execute before the Controller's method, to fill some information, or to reject the request (by returning false). Example of your `ExpressControllerAdapterModule` initialization with an added filter, that will reject access to all routes starting with '/admin' for users without that role

```typescript
new ExpressControllerAdapterModule({
    afterAuthRequestFilters: [
        {
            name: 'Protect admin zone',
            body: context => {
                return context.request.getPath().startsWith('/admin')
                    && context.request.getAuthenticationMetadata<any>().role === 'admin';
            }
        }
    ]
})
```

# This framework is a new project and for sure misses a lot of features, and has bugs

Version 0.1.x is a concept version, for this reason, it doesn't even has unitary test, usually mandatory in the projects I work for obvious reasons, but never has tested a Node project before, and researching about Mocha and Chai, requires a lot of time, Been fully unit tested is planned for version 0.2.1

Please read [CONTRIBUTING.md](./CONTRIBUTING.md)
