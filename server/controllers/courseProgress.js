
const CourseProgress= require('../models/CourseProgress');

const SubSection= require("../models/SubSection");



exports.updateCourseProgress= async(req,res)=>
{
    console.log("here is update course progress");




 const{courseId,subSectionId}= req.body;
 const userId= req.user.id;
 console.log("user id"+userId);
 try{

           const subsection = await  SubSection.findById(subSectionId)

           console.log("subsection data"+subsection);


           if(!subsection)
           {
            return res.status(404).json(
                {
                    error:"invalid subsection"
                }
            )
           }

                  let CourseProgressd= await CourseProgress.findOne(
                    {
                        courseID:courseId,
                        userId:userId,


                    }
                  )


                  if(!CourseProgressd)
                  {

                    return res.status(404).json(
                        {
                             sucess:false,
                             message:"course progress does not exist"
                        }
                    )
                  }

                  else
                  {
                     if(CourseProgressd.completedVideos.includes(subsectionId))
                     {
                        return res.status(400).json(
                            {
                                error:"subsection already completed"
                            }
                        )
                     }
                     CourseProgressd.completedVideos.push(subsectionId)









                  }



                  await CourseProgressd.save();


     
 }

 catch(err)
 {

    console.log(err);
    return res.status(400).json(
        {
            error:"internal server error"
        }
    )
 }

}