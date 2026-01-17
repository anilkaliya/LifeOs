import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: number;
    googleId?: string;
    email: string;
    password?: string;
    name: string;
    picture?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'picture' | 'googleId' | 'password'> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public googleId?: string;
    public email!: string;
    public password?: string;
    public name!: string;
    public picture?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Instance method to check password
    public async validatePassword(password: string): Promise<boolean> {
        if (!this.password) return false;
        return await bcrypt.compare(password, this.password);
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true, // Optional for local auth users
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Optional for Google auth users
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        hooks: {
            beforeCreate: async (user: User) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
            beforeUpdate: async (user: User) => {
                if (user.changed('password') && user.password) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            },
        },
    }
);

export default User;
