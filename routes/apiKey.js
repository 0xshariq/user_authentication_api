import express from "express"
import { validateApiKey } from "../controllers/apiKey.js"

const router = express.Router()

router.post("/validate", validateApiKey)

export default router

