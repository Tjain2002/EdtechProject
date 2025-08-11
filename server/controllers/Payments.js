
// import {crypt}
const  crypto = require('crypto');

const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");

const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const CourseProgress = require('../models/CourseProgress');

//  initiate order 
exports.capturePayment= async(req,res)=>
{
       
    const{courses}= req.body;

    console.log("courses="+courses);
    const userId= req.user.id;

    if(courses.length===0)
    {
        return res.json
        (
            {
              success:false,
              message:"please provide course id"
            }
        )

    }


    let totalamt= 0;
    for(const course_id of courses)
    {
        let course;
        try{
            course=await Course.findById(course_id);
            if(!course)
            {
                return res.json(
                    
                    {
                           success:false,
                           message:"could not find the course"
                    }
                )
            }


            const uid= new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid))
            {
                 return res.json(
                    
                    {
                           success:false,
                           message:"student already enrolled"
                    }
                )
            }

            totalamt= course.price+totalamt;



        }
        catch(err)
        {
           console.log(err)
           return res.status(500).json(
            {
                success:false,
                message:err.message
            }
           )
        }

    }

    const currency="INR"
     const  options= {
        amount:totalamt*100,
         currency,
         receipt:Math.random(Date.now()).toString(),

     }

     try{

        const payment=  await instance.orders.create(options);
        res.json(
            {
                success:true,
                message:payment
            }
        )
     }
     catch(err)
     {
 console.log(err);
 return res.status(500).json(
    {
        success:false,
        message:"not found"

    }
 )

     }

}



exports.verifyPayment= async(req,res)=>
{
    const razorpay_order_id= req.body?.razorpay_order_id;
    const razorpay_payment_id= req.body?.razorpay_payment_id;
    const razorpay_signature= req.body?.razorpay_signature;
    const courses= req.body?.courses;
    const  userid= req.body?.userid;
    if(!razorpay_order_id|| !razorpay_payment_id|| !razorpay_signature|| !courses|| !userid)
    {
        return res.status(500).json(
            {
                success:false,
                message:"payment failed"
            }
        )
    }
let body= razorpay_order_id+"|"+razorpay_payment_id;
    const expectedSignature= crypto.createHmac("sha256","DOdtPrjZRxQejIdj1vAzm0MY")
    .update(body.toString())
    .digest("hex");



    
        console.log("expected Signature="+expectedSignature)
        console.log("razorpay signature="+razorpay_signature)


    if(expectedSignature===razorpay_signature)
    {

        //  student will enroll
        await enrollstudent(courses,userid,res);



        console.log("expected Signature="+expectedSignature)
        console.log("razorpay signature="+razorpay_signature)






     return res.status(200).json(
        {
            success:true,
            message:"payment verified"

        }
     )
    }


    return res.status(500).json(
        {
            success:"false",
            message:"payment failed"
        }
    )
}


const enrollstudent = async(courses,userid,res)=>


{


    try{
                    if(!courses|| !userid)
            {
                return res.status(500).json(
                    {

                              success:false,
                              message:"please provide the course & user id"

                    }
                )
            }
             for(const courseid of courses)
             {

                //  find the course and enroll the student 
                   const enrolledCourse= await Course.findOneAndUpdate(
                    {_id:courseid },
                    {$push:{studentsEnrolled:userid}},
                    {new:true},
                   )


                     if(!enrolledCourse)
            {
                     return res.status(500).json(
                        {
                            success:false,
                            message:"course not  found"
                        }
                     )
            }

            const courseprogress= await CourseProgress(
                {
                         courseid:courseid,
                         userid:userid,
                         completedVideos:[],
                }
            )
            
            const enrollStudent= await User.findByIdAndUpdate(userid,

                {
                    $push:
                    {
                        courses:courseid,
                        courseprogress:courseprogress._id,
                        

                    }
                }, {new :true})





//  send mail to student
const emailsender= await mailSender(

    enrollStudent.email,
    `Successfully enrolled into ${enrolledCourse.courseName}`,
    courseEnrollmentEmail(enrolledCourse.courseName,`${enrollStudent.firstName}`,
    courseEnrollmentEmail(enrolledCourse.courseName,`${enrollStudent.lastName}`)

    )


)
console.log("email sent successfully"+emailsender.response);

 }





    }




catch(err)
{
    return res.status(500).json(
        {
            success:false,
            message:"internal error"+err.message
        }
    )
}




            //  if(!enrollstudent)
          

}





exports.mailsend= async(req,res)=>
{


    const {orderId,paymentId,amount}= req.body;
    const  userid= req.user.id;


    if(!orderId||!paymentId|| !amount|| !userid)
    {
         return res.status(400).json(
            {
                success:false,
                message:"provide neceessary details"
            }
         )
    }

     try{

        const enrollstudent = await User.findById(userid);
        await mailSender(
  enrollstudent.email,
  'Payment Received',
  paymentSucessEmail(enrollstudent.firstName, amount / 100, orderId, paymentId)
);



       


        
        
        
     }
     catch(err){
        console.log("error occur")
        return res.status(500).json(
            {
                success:false
            }
        )





     }
}








// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }
    
//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }
    

// };

//verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student andadd the course to their list enrolled courses me 
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala 
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from CodeHelp",
//                                         "Congratulations, you are onboarded into new CodeHelp Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });


//         }       
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }


// };