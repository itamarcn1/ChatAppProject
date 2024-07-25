const mongoose = require('mongoose')


const connectDb = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/FullStackFinalProject').then(() => {
        console.log("DB connection established");
    }).catch((err) => {
        console.log(err);
    })
}
module.exports = connectDb