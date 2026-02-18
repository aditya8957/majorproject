// const mongoose = require('mongoose');

// async function main() {
//     await mongoose.connect(process.env.DB_CONNECT_STRING)
// }

// module.exports = main;

const mongoose = require('mongoose');

async function main() {
    await mongoose.connect(process.env.DB_CONNECT_STRING, {
        tls: true,
        serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Connected");
}

module.exports = main;
