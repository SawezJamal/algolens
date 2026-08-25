const express = require("express");

const {
    getProblems,
    getProblemBySlug,
} = require("../controllers/problemController");

const router = express.Router();

router.get("/problems", getProblems);

router.get("/problems/:slug", getProblemBySlug);

module.exports = router;
