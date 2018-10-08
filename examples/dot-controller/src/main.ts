import { Lollipop, DiLollipopModule } from '@ts-lollipop/core';
import { DotControllerAdapterModule } from '@ts-lollipop/dot-controller-adapter';

declare const process: NodeJS.Process;

process.on('uncaughtException', error => {
    console.log(error.stack);
});

(async () => {
    const lollipop = new Lollipop('src/config.json');
    await lollipop.registerModules(
        DiLollipopModule,
        new DotControllerAdapterModule({
            directories: [
                './src/dot-controllers',
            ],
            viewsDirectory: './src/views',
            listenPort: 7474,
            doCacheViews: true,
            doCacheViewsInMemory: true
        })
    );
    await lollipop.init();
    console.log('Application ready');
})();
