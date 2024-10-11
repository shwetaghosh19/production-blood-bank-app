const mongoose=require('mongoose');
const colors=require('colors');
const database_url="mongodb://127.0.0.1:27017/bloodBank"
const connectDB=async ()=>{
  try{
    await mongoose.connect(database_url);
    console.log(`Connected to the Mongodb database ${mongoose.connection.host}`.bgMagenta.white);
    
  }
  catch(error){
    console.log(`Mongodb Database Error ${error}`.bgRed.white);
  }
}
module.exports=connectDB;