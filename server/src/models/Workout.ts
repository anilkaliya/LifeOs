import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WorkoutAttributes {
    id: number;
    name: string;
    notes?: string;
    date: Date;
    userId: number;
}

interface WorkoutCreationAttributes extends Optional<WorkoutAttributes, 'id'> { }

class Workout extends Model<WorkoutAttributes, WorkoutCreationAttributes> implements WorkoutAttributes {
    public id!: number;
    public name!: string;
    public notes?: string;
    public date!: Date;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Workout.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'workouts',
    }
);

export default Workout;
