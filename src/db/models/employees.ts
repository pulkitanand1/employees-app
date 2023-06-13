import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface employeesAttributes {
  id: number;
  emp_id: number;
  name: string;
  address: string;
  dob: string;
  dept: string;
  is_deleted?: boolean;
}

export type employeesPk = "id";
export type employeesId = employees[employeesPk];
export type employeesOptionalAttributes = "is_deleted";
export type employeesCreationAttributes = Optional<employeesAttributes, employeesOptionalAttributes>;

export class employees extends Model<employeesAttributes, employeesCreationAttributes> implements employeesAttributes {
  id!: number;
  emp_id!: number;
  name!: string;
  address!: string;
  dob!: string;
  dept!: string;
  is_deleted?: boolean;


  static initModel(sequelize: Sequelize.Sequelize): typeof employees {
    return employees.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    emp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    dept: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'employees',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "employees_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
