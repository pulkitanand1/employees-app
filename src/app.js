const express = require("express");
const { check, validationResult } = require("express-validator");
const { pgClient } = require("./utils/pgdb");

const app = express();
const port = 3001;

app.use(express.json()); // Middleware for json

app.get("/employees", (req, _res) => {
  pgClient.query(
    `select emp_id, name, address, dob, dept from employees where is_deleted = false;`,
    (err, res) => {
      if (!err) {
        _res.send(res.rows);
      } else {
        console.error(err.message);
      }
    }
  );
});

app.get("/employees/:empId", (req, res) => {
  const empId = req.params.empId;
  pgClient.query(
    `select emp_id, name, address, dob, dept from employees where emp_id = ${empId} and is_deleted = false`,
    (err, { rows } = []) => {
      if (!err) {
        if (rows.length > 0) {
          res.send(rows[0]);
        } else {
          res.send(`Cannot find any employee with id ${empId}`);
        }
      } else {
        console.error(err.message);
      }
    }
  );
});

app.post(
  "/employees",
  [
    check("empId")
      .not()
      .isEmpty()
      .withMessage("Employee id cannot be blank")
      .isInt({ min: 1 })
      .withMessage("Employee id should be a numeric value"),
    check("name").not().isEmpty().withMessage("Name cannot be blank"),
    check("address").not().isEmpty().withMessage("Address cannot be blank"),
    check("dob")
      .not()
      .isEmpty()
      .withMessage("DOB cannot be empty")
      .isISO8601()
      .withMessage("Date format should be yyyy-MM-dd"),
    check("dept").not().isEmpty().withMessage("Department cannot be empty"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const { empId, name, address, dob, dept } = req.body;
      checkIfEmployeeIdExists(empId, (isDuplicate) => {
        if (isDuplicate) {
          return res.status(400).json({
            errors: [
              {
                msg: "Employee id already exists",
              },
            ],
          });
        } else {
          const sql = `insert into employees(emp_id, name, address, dob, dept) values(${empId}, '${name}', '${address}', '${dob}', '${dept}')`;
          pgClient.query(sql, (err, response) => {
            if (!err) {
              res.sendStatus(200);
            } else {
              console.error(err.message);
              res.sendStatus(500);
            }
          });
        }
      });
    }
  }
);

app.put(
  "/employees/:empId",
  [
    check("name").optional(),
    check("address").optional(),
    check("dob")
      .optional()
      .isISO8601()
      .withMessage("Date format should be yyyy-MM-dd"),
    check("dept").optional(),
  ],
  (req, res) => {
    const empId = req.params.empId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const { name = "", address = "", dob = "", dept = "" } = req.body;
      checkIfEmployeeIdExists(empId, (doesExist) => {
        if (doesExist) {
          const sql = `update employees 
            set 
            name = case when '${name}' = '' then name else '${name}' end,
            address = case when '${address}' = '' then address else '${address}' end,
            dob = case when '${dob}' = '' then dob else '${dob}' end,
            dept = case when '${dept}' = '' then dept else '${dept}' end
            where emp_id = ${empId}
             and is_deleted = false;`;
          pgClient.query(sql, (err, response) => {
            if (!err) {
              res.sendStatus(200);
            } else {
              console.error(err.message);
              res.sendStatus(500);
            }
          });
        } else {
          return res.status(400).json({
            errors: [
              {
                msg: "Employee id not found",
              },
            ],
          });
        }
      });
    }
  }
);

checkIfEmployeeIdExists = (empId, callback) => {
  pgClient.query(
    `select 1 from employees where emp_id = ${empId}`,
    (err, { rowCount }) => {
      if (!err) {
        callback(rowCount > 0);
      } else {
        console.error(err.message);
      }
    }
  );
};

app.listen(port, () => console.log(`App is running on port ${port}`));
