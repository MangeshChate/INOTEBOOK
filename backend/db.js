const mongoose = require('mongoose')
const mongoURI  = "mongodb+srv://mangesh:QYTLPQdNOFoTwxuz@cluster0.6hhshhc.mongodb.net/inoteBookDB?retryWrites=true&w=majority"

const connectToMongo = () =>{
    mongoose.set('strictQuery', false);

mongoose.connect(mongoURI).then(()=>{
    console.log("mongo connection successfully !");

}).catch((e)=>{
    console.log("Error in Conecction !"+e);
})
}

module.exports = connectToMongo;