import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, "Please enter your name"] 
    },
    email: {
        type: String,
        required:[true, "Please enter your email"],
        unique: true,
        lowercase: true,
        trim:true
    },
    password: {
        type: String,
        required:[true, "Please enter your password"],
        minlength:6
    },
    cartItems: [
        {
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            }

        }
    ],
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
 }, 
 { 
    timestamps: true 
});

// pre save hook to hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
     }
     try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

  userSchema.methods.comparePassword = async function (Password) {
    return await bcrypt.compare(Password, this.password);
  }
  const User = mongoose.model('User', userSchema);


export default User;

