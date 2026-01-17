import sequelize from './config/database';

const testConnection = async () => {
    try {
        console.log('Testing connection...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

testConnection();
