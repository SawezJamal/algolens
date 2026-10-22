require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../models/Problem');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const r = await Problem.updateOne(
      { slug: 'two-sum' },
      {
        $set: {
          testCases: [
            {
              input: '{"nums":[2,7,11,15],"target":9}',
              output: '0 1'
            },
            {
              input: '{"nums":[3,2,4],"target":6}',
              output: '1 2'
            },
            {
              input: '{"nums":[3,3],"target":6}',
              output: '0 1'
            },
            {
              input: '{"nums":[1,5,8,10],"target":15}',
              output: '1 3'
            },
            {
              input: '{"nums":[-1,-2,-3,-4,-5],"target":-8}',
              output: '2 4'
            }
          ]
        }
      }
    );

    console.log(r);
    await mongoose.disconnect();
  })
  .catch(console.error);
