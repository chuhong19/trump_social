const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://giabao:1234@clustertest.mhrobf7.mongodb.net/my_social?retryWrites=true&w=majority');
        console.log("Connect successfully");
    }
    catch (error){
        console.log("Fail to connect database", error);
    }
}

module.exports = {connect};