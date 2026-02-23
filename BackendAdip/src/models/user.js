const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        minLength:3,
        maxLength:20
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        lowercase:true,
        immutable: true,
    },
    address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: { type: String, default: "India" }
    },
    age:{
        type:Number,
        min:6,
        max:80,
    },
    phone: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    role:{
        type:String,
        enum:['user','admin','ngo'],
        default: 'user'
    },
    isNgoRequested:{
    type:Boolean,
    default:false
    },
    isNgoApproved:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required: true
    }
},{
    timestamps:true
});


const User = mongoose.model("user",userSchema);

module.exports = User;
