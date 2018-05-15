import { Component, PostInject } from '@ts-lollipop/core';

@Component()
export class LoginComponent {

    public some = 'yeah';

    @PostInject()
    public async onInit(): Promise<void> {
        this.some = 'changed value';
    }
}
