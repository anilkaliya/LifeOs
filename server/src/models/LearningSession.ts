import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LearningAttributes {
    id: number;
    topic: string;
    durationMinutes: number;
    date: Date;
    userId: number;
}

interface LearningCreationAttributes extends Optional<LearningAttributes, 'id'> { }

class LearningSession extends Model<LearningAttributes, LearningCreationAttributes> implements LearningAttributes {
    public id!: number;
    public topic!: string;
    public durationMinutes!: number;
    public date!: Date;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

LearningSession.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        topic: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        durationMinutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
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
        tableName: 'learning_sessions',
    }
);

export default LearningSession;
