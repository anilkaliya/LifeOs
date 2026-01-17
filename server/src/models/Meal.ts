import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface MealAttributes {
    id: number;
    mealName: string;
    description: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    date: Date;
    userId: number;
}

interface MealCreationAttributes extends Optional<MealAttributes, 'id'> { }

class Meal extends Model<MealAttributes, MealCreationAttributes> implements MealAttributes {
    public id!: number;
    public mealName!: string;
    public description!: string;
    public calories!: number;
    public protein?: number;
    public carbs?: number;
    public fat?: number;
    public date!: Date;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Meal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        mealName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        protein: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        carbs: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        fat: {
            type: DataTypes.FLOAT,
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
        tableName: 'meals',
    }
);

export default Meal;
