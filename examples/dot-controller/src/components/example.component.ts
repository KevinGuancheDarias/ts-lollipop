import { Component } from '@ts-lollipop/core';
import { HelloWorldInformation } from '../types/hello-world-information.type';

@Component()
export class ExampleComponent {
    public findTemplateDate(): HelloWorldInformation {
        return {
            name: 'Some text',
            thing: 18
        };
    }
}
