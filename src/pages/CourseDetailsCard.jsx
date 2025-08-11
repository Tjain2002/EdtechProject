import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_TYPE } from "../utils/constants";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";
import { addToCart } from "../slices/cartSlice";

export const CourseDetailsCard = ({ course, setConfirmationModal, handleCourse }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("Instructors can't purchase courses");
      return;
    }

    if (token) {
      dispatch(addToCart(course));
    } else {
      setConfirmationModal({
        text1: "You're not logged in",
        text2: "Login to purchase the course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const {
    thumbnail,
    price,
    studentsEnrolled = [],
    instructions = [],
  } = course;

  return (
    <div className="bg-richblack-700 p-4 rounded-lg shadow-lg text-white">
      <img
        src={thumbnail}
        alt="Course Thumbnail"
        className="w-full h-[200px] object-cover rounded-md mb-4"
      />

      <div className="text-2xl font-bold text-yellow-50 mb-4">₹{price}</div>

      {!studentsEnrolled.includes(user?._id) && (
        <button
          onClick={handleAddToCart}
          className="bg-yellow-50 text-richblack-900 w-full py-2 rounded-md font-semibold hover:scale-105 transition"
        >
          Add to Cart
        </button>
      )}

      <button
        onClick={
          user
            ? studentsEnrolled.includes(user?._id)
              ? () => navigate("/dashboard/enrolled-courses")
              : handleCourse
            : null
        }
        className="bg-richblack-800 text-white w-full py-2 mt-4 rounded-md hover:scale-105 transition"
      >
        {user && (studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now")}
      </button>

      <p className="text-sm text-center text-richblack-300 mt-4">
        30-Day Money Back Guarantee
      </p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">This Course Includes:</h3>
        <ul className="text-sm list-disc list-inside space-y-1">
          {instructions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center mt-6">
        <button onClick={handleShare} className="text-yellow-50 underline text-sm">
          Share
        </button>
      </div>
    </div>
  );
};
