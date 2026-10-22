require("dotenv").config();
const mongoose = require("mongoose");
const Problem = require("../models/Problem");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const ps = await Problem.find({
      categories: { $in: ["Arrays", "Hashing"] },
      "execution.enabled": { $ne: true }
    })
    .select("title slug categories execution testCases starterCode expectedTimeComplexity expectedSpaceComplexity")
    .lean();

    console.log(JSON.stringify(
      ps.map((p, i) => ({
        no: i + 1,
        title: p.title,
        slug: p.slug,
        categories: p.categories,
        execution: p.execution,
        testCases: p.testCases,
        starterCode: p.starterCode,
        expectedTimeComplexity: p.expectedTimeComplexity,
        expectedSpaceComplexity: p.expectedSpaceComplexity
      })),
      null,
      2
    ));

    await mongoose.disconnect();
  })
  .catch(console.error);
