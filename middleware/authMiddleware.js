const jwt=require('jsonwebtoken');
module.exports=async(req,res,next)=>{
    try {
        const authHeader = req.headers['authorization'];

    // Check if the header is present and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({
        success: false,
        message: 'Authorization token missing or malformed',
      });
     }
        const token=req.headers['authorization'].split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                return res.status(401).send({
                    success:false,
                    message:'Auth Failed'
                })

            }
            else{
                req.body.UserId=decode.UserId;
                next();
            }

        })
    } catch (error) {
     console.log(error);
     return res.status(401).send({
        success:false,
        error,
        message:'Auth failed'
     })
        
    }
}