import { ConnectionOptions, createConnection, Connection } from 'typeorm';
import { AbstractDatabaseAdapterModule } from '@ts-lollipop/core/dist/adapters/database/abstract-database-adapter.module';

export class TypeOrmDatabaseAdapterModule extends AbstractDatabaseAdapterModule {
    private _connection: Connection;

    public constructor(private _options: ConnectionOptions) {
        super(_options);
    }

    public getConnection(): Connection {
        return this._connection;
    }

    public async setupConnection(): Promise<void> {
        this._connection = await createConnection(this._options);
    }
}
