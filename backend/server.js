const express = require("express");
const cors = require("cors");

const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());
const executionRoutes = require("./routes/execution");
app.get("/", (req, res) => {
    res.json({
        message: "AlgoLens backend is running",
    });
});

app.use("/api", analysisRoutes);
app.use("/api", executionRoutes);

app.listen(PORT, () => {
    console.log(
        `AlgoLens backend running on http://localhost:${PORT}`
    );
});