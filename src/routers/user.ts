import {Router} from "express";
import { check, validationResult } from "express-validator";
import pgClient from "../utils/pgdb";
import * as auth from "../utils/authentication";

const router = Router();

router.post(
  "/auth",
  [
    check("userName").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userName, password } = req.body;
    pgClient.query(
      `select id from users where username = '${userName}' and password = '${password}'`,
      async (err, _res) => {
        if (!err) {
          const rows = _res.rows;
          if (rows && rows.length > 0) {
            const userId = rows[0].id;
            const token = await auth.generateToken(userId);
            res.send({
              token,
            });
          } else {
            res.sendStatus(401);
          }
        } else {
          console.error(err.message);
          res.sendStatus(500);
        }
      }
    );
  }
);

const userRouter = router;
export  default userRouter;