const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {type:String,required:true},
    email: {type:String,required:[true, "Email is required"],unique:true},
    password: {type:String,required:[true, "password is required"],minlength: [6, 'Password must be at least 6 characters long']}
},{timestamps:true});

userSchema.pre('save',async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }
    next();
})

userSchema.methods.correctPassword = async function (candidatePass,userPass){
    return await bcrypt.compare(candidatePass,userPass);
}

module.exports = mongoose.model("User",userSchema);