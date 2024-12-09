import express from "express";
import { getAllUsers, getNewUser, getUserById } from "../controllers/user.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.post("/new", getNewUser);

router.get("/userid/:id", getUserById);

export default router;
