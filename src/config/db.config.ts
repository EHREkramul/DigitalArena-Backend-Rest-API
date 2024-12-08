import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default ():PostgresConnectionOptions =>(
    {
        type: 'postgres',
        host: process.env.db_host,
        port: +process.env.db_port,
        username: process.env.db_user,
        password: process.env.db_password,
        database: process.env.db_name,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
    }
)