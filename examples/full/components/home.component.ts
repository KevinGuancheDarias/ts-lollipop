import { Component, Inject, PostInject } from '@ts-lollipop/core';
import { LoginComponent } from './login.component';

@Component()
export class HomeComponent {

    @Inject()
    private _loginComponent: LoginComponent;

    @PostInject()
    public async onInit(): Promise<void> {
        console.log('Holy shit');
        console.log('PostInject LoginComponent is', this._loginComponent.some);
    }
}
