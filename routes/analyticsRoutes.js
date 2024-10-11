const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { bloodGroupDetailsController } = require('../controllers/analyticsController')
const router=express.Router()

//get donar records
router.get('/bloodGroups-data',authMiddleware,bloodGroupDetailsController)

module.exports=router