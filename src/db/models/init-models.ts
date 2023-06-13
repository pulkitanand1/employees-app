import type { Sequelize } from "sequelize";
import { employees as _employees } from "./employees";
import type { employeesAttributes, employeesCreationAttributes } from "./employees";
import { users as _users } from "./users";
import type { usersAttributes, usersCreationAttributes } from "./users";

export {
  _employees as employees,
  _users as users,
};

export type {
  employeesAttributes,
  employeesCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const employees = _employees.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    employees: employees,
    users: users,
  };
}
