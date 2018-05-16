import { ConnectionOptions, createConnection, Connection } from 'typeorm';
import { AbstractDatabaseAdapterModule } from '@ts-lollipop/core/dist/adapters/database/abstract-database-adapter.module';

/**
 * TypeOrm implementation for database operations in Lollipop
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @export
 * @class TypeOrmDatabaseAdapterModule
 * @since 0.1.0
 * @extends {AbstractDatabaseAdapterModule}
 */
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
