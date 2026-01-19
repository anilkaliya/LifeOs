import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SkinCareAttributes {
    id: number;
    date: string; // YYYY-MM-DD
    detan: boolean;
    oiling: boolean;
    sunscreen: boolean;
    customRoutine?: string;
    userId: number;
}

interface SkinCareCreationAttributes extends Optional<SkinCareAttributes, 'id' | 'detan' | 'oiling' | 'sunscreen' | 'customRoutine'> { }

class SkinCareLog extends Model<SkinCareAttributes, SkinCareCreationAttributes> implements SkinCareAttributes {
    public id!: number;
    public date!: string;
    public detan!: boolean;
    public oiling!: boolean;
    public sunscreen!: boolean;
    public customRoutine?: string;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

SkinCareLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        detan: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        oiling: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sunscreen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        customRoutine: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'skin_care_logs',
    }
);

export default SkinCareLog;
