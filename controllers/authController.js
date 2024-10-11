const userModel=require('../models/userModels');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const registerController=async(req,res)=>{
    try{
        
        console.log(req.body);  // Check the role and other fields
        const existingUser= await userModel.findOne({email:req.body.email})
        //validation
        if(existingUser){
          return res.status(200).send({
            success:false,
            message:'User Already exists '
          })  
        }
        //hash password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        req.body.password=hashedPassword
        //rest data
        const user=new userModel(req.body)
        await user.save();
        return res.status(201).send({
            success:true,
            message:'User Registered Successfully',
            user,
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error In Register API',
            error
        })
        
    }

};
//login callback
const loginController=async (req,res)=>{
    try {
        const User= await userModel.findOne({email:req.body.email});
        if(!User){
            return res.status(404).send({
                success:false,
                message:'Invalid Credential'
            })
        }
        //check role
        if(User.role!==req.body.role){
            return res.status(500).send({
                success:false,
                message:"Role does not match"
            })
        }
        //comparing password
        const comparePassword=await bcrypt.compare(req.body.password,User.password);
        if(!comparePassword){
            return res.status(500).send({
                success:false,
                message:'Invalid Credential'
            })
        }
        const token=jwt.sign({UserId:User._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        return res.status(200).send({
            success:true,
            message:"logged in successfully",
            token,
            User
        })

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:"Error in LOGIN API",
            error
        });
        
    }
}
const currentUserController= async(req,res)=>{
    try {
        const user=await userModel.findOne({_id:req.body.UserId});
        return res.status(200).send({
            success:true,
            message:"user fetched successfully",
            user
            
        })        
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success:false,
            message:"Unable to get current user",
            error
        });

    }
}
module.exports={registerController,loginController,currentUserController}