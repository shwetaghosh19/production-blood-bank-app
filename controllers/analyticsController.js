const inventoryModel = require("../models/inventoryModel")
const mongoose=require('mongoose')

//get all Blood data
const bloodGroupDetailsController=async(req,res)=>{
    try {
        const bloodGroups=['O+','O-','AB+','AB-','A+','A-','B+','B-']
        const bloodGroupData=[]
        const organisation=new mongoose.Types.ObjectId(req.body.UserId)
        //get single data
        await Promise.all(bloodGroups.map((async(bloodGroup)=>{
            //To count total in
            const totalIn=await inventoryModel.aggregate([
            {$match:{
                bloodGroup:bloodGroup,
                inventoryType:'in',
                organisation

            }},
            {
                $group:{
                    _id:null,
                   total: {$sum: '$quantity'}

                }
            }
        ])
        const totalOut=await inventoryModel.aggregate([
            {$match:{
                bloodGroup:bloodGroup,
                inventoryType:'out',
                organisation

            }},
            {
                $group:{
                    _id:null,
                   total: {$sum: '$quantity'}

                }
            }
        ]);
        //calculate Total
        const availableBlood=(totalIn[0]?.total || 0)-(totalOut[0]?.total || 0)
        //PUSH DATA
        bloodGroupData.push({
            bloodGroup,
            totalIn:totalIn[0]?.total || 0,
            totalOut:totalOut[0]?.total || 0,
            availableBlood,
        })
        })));
        return res.status(200).send({
            success:true,
            message:"Blood Group Data Fetched Successfully",
            bloodGroupData
        })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success:false,
        message:"Error In Blood Group API",
        error
      })  
    }

}
module.exports={bloodGroupDetailsController}