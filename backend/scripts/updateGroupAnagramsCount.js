require("dotenv").config();

const mongoose = require("mongoose");
const Problem = require("../models/Problem");

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        const result = await Problem.updateOne(
            { slug: "group-anagrams-count" },
            {
                $set: {
                    execution: {
                        enabled: true,
                        runnerType: "array",
                        functionName: "countAnagramGroups",
                        returnType: "int",
                        parameters: [
                            {
                                name: "strs",
                                type: "vector<string>"
                            }
                        ]
                    }
                }
            }
        );

        console.log(result);

        await mongoose.disconnect();
    })
    .catch(console.error);