import {Router} from "express";
import { check, validationResult } from "express-validator";
import * as auth from "../utils/authentication";
import { users } from "../db/models/users";

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
    const user = await users.findOne({
      where: {
        username: userName,
        password: password
      }
    });
    if(user?.dataValues){
      const userId = user.dataValues.id;
      const token = await auth.generateToken(userId);
      res.send({
        token,
      });
    }
    else {
      res.sendStatus(401);
    }
  }
);

const userRouter = router;
export  default userRouter;