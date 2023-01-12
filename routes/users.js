import express from "express";
import { getUser, updateUser } from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser) // the call back function (req,res) have been made in controllers folder
router.put("/", updateUser)

export default router; // we can use this user router in the index.js file and make any API request