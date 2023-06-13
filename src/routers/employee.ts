import express from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth";
import { employees } from "../db/models/employees";

const router = express.Router();

router.get("/employees", auth, async (req, _res) => {
  const emps = await employees.findAll();
  const data = emps.map(({ dataValues }) => {
    return {
      empId: dataValues.id,
      name: dataValues.name,
      address: dataValues.address,
      dob: dataValues.dob,
      dept: dataValues.dept,
    };
  });
  _res.send(data);
});

router.get("/employees/:empId", auth, async (req, res) => {
  const empId = req.params.empId;
  const emps = await employees.findAll({
    where: {
      emp_id: empId,
    },
  })
  const data = emps.map(({ dataValues }) => {
    return {
      empId: dataValues.id,
      name: dataValues.name,
      address: dataValues.address,
      dob: dataValues.dob,
      dept: dataValues.dept,
    };
  });
  res.send(data);
});

router.post(
  "/employees",
  auth,
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
      const isDuplicate = await checkIfEmployeeIdExists(empId);
      if (isDuplicate) {
        return res.status(400).json({
          errors: [
            {
              msg: "Employee id already exists",
            },
          ],
        });
      } else {
        await employees.create({
          emp_id: empId,
          name,
          address,
          dob,
          dept
        });
        res.sendStatus(200);
      }
    }
  }
);

router.put(
  "/employees/:empId",
  auth,
  [
    check("name").optional(),
    check("address").optional(),
    check("dob")
      .optional()
      .isISO8601()
      .withMessage("Date format should be yyyy-MM-dd"),
    check("dept").optional(),
  ],
  async (req, res) => {
    const empId = req.params.empId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const { name, address, dob, dept } = req.body;
      const existingEmployee = await employees.findOne({
        where: {
          emp_id: empId
        }
      });
      if (existingEmployee) {
        employees.update({
          name: name ?? existingEmployee.name,
          address: address ?? existingEmployee.address,
          dob: dob ?? existingEmployee.dob,
          dept: dept ?? existingEmployee.dob
        }, {
          where: {
            emp_id: empId
          }
        })
        res.sendStatus(200);
      } else {
        return res.status(400).json({
          errors: [
            {
              msg: "Employee id not found",
            },
          ],
        });
      }
    }
  }
);

const checkIfEmployeeIdExists = async (empId: number) => {
  const emps = await employees.findOne({
    where: {
      emp_id: empId,
    },
  });
  return emps != undefined;
};

const employeeRouter = router;
export default employeeRouter;
