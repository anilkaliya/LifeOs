import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import * as pg from 'pg';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    dialectModule: pg,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

export default sequelize;
