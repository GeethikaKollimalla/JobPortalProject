const express = require("express");
const router = express.Router();

const Job = require("../models/Job");
const authMiddleware = require("../middleware/auth.Middleware");
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.post("/create", authMiddleware, async (req, res) => {
    try {

        const {
            title,
            company,
            location,
            salary,
            description
        } = req.body;

        const job = new Job({
            title,
            company,
            location,
            salary,
            description,
            postedBy: req.user.id
        });

        await job.save();

        res.status(201).json({
            message: "Job Posted Successfully",
            job
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
});
router.get("/myjobs", authMiddleware, async (req, res) => {

    try {
        console.log("Logged User:", req.user.id);

        const jobs = await Job.find({
        });
console.log(jobs);
        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

});
module.exports = router;