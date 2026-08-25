const express = require("express");

const {
    analyze,
    getAnalyses,
    getAnalysisById,
} = require("../controllers/analysisController");

const router = express.Router();

router.post("/analyze", analyze);

router.get("/analyses", getAnalyses);

router.get("/analyses/:id", getAnalysisById);

module.exports = router;