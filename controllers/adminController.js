const userModels = require("../models/userModels")

const getDonarListController=async (req,res)=>{
    try {
        const donarData=await userModels.find({role:"donar"}).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            TotalCount:donarData.length,
            message:"Donar List Fetched Successfully",
            donarData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In Donar List API',
            error
        })
    }

}
const getHospitalListController=async (req,res)=>{
    try {
        const hospitalData=await userModels.find({role:"hospital"}).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            TotalCount:hospitalData.length,
            message:"Hospital List Fetched Successfully",
            hospitalData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In Hospital List API',
            error
        })
    }

}
const getOrgListController=async (req,res)=>{
    try {
        const orgData=await userModels.find({role:"organisation"}).sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            TotalCount:orgData.length,
            message:"Organisation List Fetched Successfully",
            orgData
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error In Organisation List API',
            error
        })
    }

}
const deleteDonarController=async (req,res)=>{
    try {
        await userModels.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success:true,
            message:"Record Deleted Successfully",
            
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error while deleting donar',
            error
        })
    }

}
module.exports={getDonarListController,getHospitalListController,getOrgListController,deleteDonarController}