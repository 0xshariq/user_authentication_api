import express from "express";
import { getAllUsers, login, logout, register } from "../controllers/user.js";

const router = express.Router();

router.get("/all", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
