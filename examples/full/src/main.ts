import { Lollipop, DiLollipopModule, ContextHolder } from '@ts-lollipop/core';
import { ExpressControllerAdapterModule } from '@ts-lollipop/express-controller-adapter';
import { TypeOrmDatabaseAdapterModule } from '@ts-lollipop/typeorm-database-adapter';
import { Category } from './entities/category';
import { JwtControllerSecurityAdapterModule } from '@ts-lollipop/jwt-controller-security-adapter';
import { CategoryComponent } from './components/category.component';

declare const process: NodeJS.Process;

process.on('uncaughtException', error => {
    console.log(error.stack);
});

process.on('unhandledRejection', error => {
    console.log(error.stack);
});

(async () => {
    const lollipop = new Lollipop('config.json');
    await lollipop.registerModules(
        new TypeOrmDatabaseAdapterModule({
            type: 'sqlite',
            database: 'lollipop_test.db',
            entities: [Category],
            synchronize: true
        }),
        DiLollipopModule,
        new ExpressControllerAdapterModule({
            directories: [
                './controllers'
            ],
            securityAdapters: [
                new JwtControllerSecurityAdapterModule({ secret: '1234', checkAll: true })
            ],
            listenPort: 7474
        })
    );
    await lollipop.init();
    console.log('Application ready');
    console.log(
        'Categories in database are',
        await ContextHolder.getDiModule().getComponent(CategoryComponent).findAll());
})();
