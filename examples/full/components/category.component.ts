import { Component, DatabaseConnection, PostInject } from '@ts-lollipop/core';
import { Category } from '../entities/category';
import { Connection, Repository } from 'typeorm';

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

    public findAll(): Promise<Category[]> {
        return this._repository.find();
    }

    private async _createDefaultCategories(): Promise<void> {
        await this._repository.save<Category>([
            {
                id: 1,
                description: 'Welcome to Lollipop'
            },
            {
                id: 2,
                description: 'Why should I use Lollipop?'
            }
        ]);
    }

}
