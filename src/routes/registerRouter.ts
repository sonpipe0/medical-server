import e, { Router } from "express";
import { registerAdminController } from "../controllers/registerController";

const registerRouter = Router();

registerRouter.post("/register", registerAdminController);

export default registerRouter;
