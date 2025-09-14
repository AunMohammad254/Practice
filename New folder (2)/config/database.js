const mongoose = require('mongoose');
const uri = 'mongodb+srv://aunmohammad254_db_user:DZtAQGMkmnctzd1S@cluster0.xxothym.mongodb.net/express-mongo?retryWrites=true&w=majority';

async function connectDB() {
    await mongoose.connect(uri);
}

module.exports = {
    connectDB
}

