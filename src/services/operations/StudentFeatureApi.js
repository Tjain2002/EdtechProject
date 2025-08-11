import toast from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
// import { FaSortAmountDown } from "react-icons/fa";
// import rzplog from '../../assets/Logo/rzp_logo.png';
// import { verifyPayment } from "../../../server/controllers/Payments";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const{COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}= studentEndpoints;

function loadScript(src)
{
    return new Promise((resolve)=>
    {
        const script= document.createElement('script');
        script.src=src;
        script.onload=()=>
        {
            resolve(true);
        }

         script.onerror=()=>
         {
            resolve(false);
         }

         document.body.appendChild(script)
    })
}
export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
  const toastId = toast.loading("Loading...");
  try {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const order = await apiConnector("POST", COURSE_PAYMENT_API, { courses }, {
      Authorization: `Bearer ${token}`
    });

    if (!order.data.success) {
      throw new Error(order.data.message);
    }

    const options = {
      key: "rzp_test_t4LUM04KXw6wHc",
      currency: order.data.message.currency,
      amount: `${order.data.message.amount}`,
      order_id: order.data.message.id,
      name: "StudyNotion",
      description: "Thank you for purchasing",
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, order.data.message.amount, token);
        verifypayment({ ...response, courses, userid: userDetails._id }, token, navigate, dispatch);
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function () {
      toast.error("Payment failed");
    });

  } catch (err) {
    console.log(err);
    toast.error("Could not complete payment");
  }

  toast.dismiss(toastId);
}






















async function sendPaymentSuccessEmail(response,amount,token)
{
    try{

 await apiConnector(SEND_PAYMENT_SUCCESS_EMAIL_API,{

     order_Id:response.razorpay_order_id,
     payment_Id:response.razorpay.payment_id,
     amount,





 }

 ,
 {
    Authorization:`Bearer ${token}`
 }
)


    }
    catch(err)
    {

        console.log("payment issue..........");
    }
}

async function verifypayment(bodyData,token,navigate,dispatch)
{


    const toastId =toast.loading("verifying payment");
    dispatch(setPaymentLoading(true));




     try{

        const response= await apiConnector("POST",COURSE_VERIFY_API,bodyData,{

            Authorization:`Bearer ${token}`,
        })


        if(!response.data.success)
        {
             throw   new Error(response.data.message);
        }

        toast.success("payment successfull , you are added to the course")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());




     }
     catch(err)
     {
console.log("payment verify error...");
toast.error("could not verify payment");
     }

     toast.dismiss(toastId);
     dispatch(setPaymentLoading(false));
}

