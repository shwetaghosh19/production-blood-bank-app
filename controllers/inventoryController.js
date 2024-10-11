const mongoose = require('mongoose');
const inventoryModel = require('../models/inventoryModel');
const userModels=require('../models/userModels')
const createInventoryController=async (req,res)=>{
 try{
   //validation
   const {email}=req.body
   const user=await userModels.findOne({email});
    if(!user){
        throw new Error("User Not Found");
    }
    // if(inventoryType==="in"&& user.role!=='donar'){
    //     throw new Error("Not a donar account");
    // }
    // if(inventoryType==="out"&& user.role!=='hospital'){
    //     throw new Error("Not a hospital account");
    // }

   
    if(req.body.inventoryType=='out'){
        const requestedBloodGroup=req.body.bloodGroup
        const requestedQuantity=req.body.quantity
        const organisation= new mongoose.Types.ObjectId(req.body.UserId)
        //calculate Blood Quantity
        const totalInOfRequestedBlood=await inventoryModel.aggregate([
        {   $match:{
            organisation,
            inventoryType:'in',
            bloodGroup:requestedBloodGroup

        }},{
            $group:{
                _id:'$bloodGroup',
                total:{$sum : '$quantity'}
            },
        },
        ]);
        const totalIn=totalInOfRequestedBlood[0]?.total||0
        //calculate Total Blood out calculation
        const totalOutOfRequestedBlood=await inventoryModel.aggregate([
            {   $match:{
                organisation,
                inventoryType:'out',
                bloodGroup:requestedBloodGroup
    
            }},{
                $group:{
                    _id:'$bloodGroup',
                    total:{$sum : '$quantity'}
                },
            },
            ]);
            const totalOut=totalOutOfRequestedBlood[0]?.total||0
            //in & out calc
            const availableQuantity=totalIn-totalOut
            //quantity validation
            if(availableQuantity<requestedQuantity){
                return res.status(500).send({
                    success:false,
                    message:`Only ${availableQuantity}ML of ${requestedBloodGroup.toUpperCase()} is available`

                })
            }
            req.body.hospital=user?._id
    }
    else{
        req.body.donar=user?._id;   
    }
    //save record
    const inventory=new inventoryModel(req.body)
    await inventory.save();
    return res.status(201).send({
        success:true,
        message:"New Blood record added"
    })
}
 catch(error){
    console.log(error)
    return res.status(500).send({
        success:false,
        message:'Error in Create Inventory API',
        error
    })
 }
};
//get all Blood Records
const getInventoryController=async(req,res)=>{
    try{
        const inventory=await inventoryModel.find({organisation:req.body.UserId}).populate('donar').populate('hospital').sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            message:"getting all records SUCCESSFULLY!!",
            inventory
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In  Get all Inventory",
            error
        })
    }
}
const getInventoryHospitalController=async(req,res)=>{
    try{
        const inventory=await inventoryModel.find(req.body.filters).populate('donar').populate('hospital').populate('organisation').sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            message:"getting all records SUCCESSFULLY!!",
            inventory
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error In Consumer Inventory",
            error
        })
    }
}
const getDonarsController=async (req,res)=>{
    try {
      const organisation=req.body.UserId
      //find donars
      const donarId=await inventoryModel.distinct("donar",{organisation}) 
    //   console.log(donarId) 
    const donars=await userModels.find({_id:{$in:donarId}})
    return res.status(200).send({
        success:true,
        message:'Donar record fetched successfully!!',
        donars
    })    
} catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Donar records',
            error
        })
       
    }

}
const getHospitalsController=async (req,res)=>{
    try {
        const organisation=req.body.UserId
        const hospitalId=await inventoryModel.distinct('hospital',{organisation})
        //Find hospital
        const hospitals=await userModels.find({
            _id:{$in:hospitalId}
        })
        return res.status(200).send({
            success:true,
            message:'Hospitals Data Fetched Successfully',
            hospitals,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message:'Error In hospital API',
            error,
        })
        
    }
}
const getOrganisationsController=async(req,res)=>{
    try {
        const donar=req.body.UserId
        const orgIds=await inventoryModel.distinct('organisation',{donar})  
        //find org
        
        const organisations = await userModels.find({ _id: { $in: orgIds } });
        console.log("Fetched Organisations:", organisations);
        return res.status(200).send({
            success:true,
            message:'Organisation Data Fetched Successfully',
            organisations,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Organisation records',
            error
        })
       
    } 
}
//get record of 3
const getRecentInventoryController=async (req,res)=>{
    try {
        const inventory=await inventoryModel.find({
            organisation:req.body.UserId
        }).limit(3).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:"Recent Inventory data fetched successfully",
            inventory
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In Recent Inventory API',
            error
        })
    }
}
const getOrganisationsForHospitalController=async(req,res)=>{
    try {
        const hospital=req.body.UserId
        const orgIds=await inventoryModel.distinct('organisation',{hospital})  
        //find org
        
        const organisations = await userModels.find({ _id: { $in: orgIds } });
        return res.status(200).send({
            success:true,
            message:'Hospital Organisation Data Fetched Successfully',
            organisations,
        });


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Hospital Organisation records',
            error
        })
       
    } 
}

module.exports={createInventoryController,getInventoryController,getDonarsController,getHospitalsController,getOrganisationsController,getOrganisationsForHospitalController,getInventoryHospitalController,getRecentInventoryController};