import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyCourse } from "../services/operations/StudentFeatureApi";
import { useNavigate, useParams } from "react-router-dom";
import RatingStars from "../components/common/RatingStars";
import GetAvgRating from "../utils/avgRating";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import toast from "react-hot-toast";
import { CourseDetailsCard } from "./CourseDetailsCard";
import { formatDate } from "../services/formatDate";
import Error from "../pages/Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";

export const CourseDetails = () => {
  const { user, loading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [coursedata, setcoursedata] = useState({});
  const [avgreviewcount, setavgreviewcount] = useState(0);
  const [totalnumberlecture, setlecture] = useState(0);
  const [confirmationmodal, setconfirmationmodal] = useState(null);
  const [isactive, setactive] = useState([]);

  useEffect(() => {
    const getcoursedata = async () => {
      try {
        toast.loading("Loading...");
        const result = await fetchCourseDetails(courseId);
        setcoursedata(result);
      } catch (err) {
        console.log("Could not fetch course data", err);
      } finally {
        toast.dismiss();
      }
    };
    getcoursedata();
  }, [courseId]);

  useEffect(() => {
    const count = GetAvgRating(coursedata.data?.courseDetails.ratingAndReviews);
    setavgreviewcount(count);
  }, [coursedata]);

  useEffect(() => {
    let count = 0;
    coursedata.data?.courseDetails?.courseContent?.forEach((sec) => {
      count += sec.subSection?.length || 0;
    });
    setlecture(count);
  }, [coursedata]);

  const handleactive = (id) => {
    setactive((prev) =>
      !prev.includes(id) ? [...prev, id] : prev.filter((e) => e !== id)
    );
  };

  const handlecourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
    } else {
      setconfirmationmodal({
        text1: "You're not logged in",
        text2: "Login is required to purchase a course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1handler: () => navigate("/login"),
        btn2handle: () => setconfirmationmodal(null),
      });
    }
  };

  if (loading || !coursedata.data?.courseDetails) {
    return <div className="text-center text-white py-10">Loading...</div>;
  }

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = coursedata.data.courseDetails;

  return (
    <>
      <div className="bg-richblack-900 text-white px-4 md:px-10 py-10  max-w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left section */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <h1 className="text-2xl md:text-3xl font-bold">{courseName}</h1>
            <p className="text-richblack-100">{courseDescription}</p>

            <div className="text-sm flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-50 font-semibold">{avgreviewcount.toFixed(1)}</span>
                <RatingStars Review_Count={avgreviewcount} Star_Size={20} />
                <span className="text-richblack-300">({ratingAndReviews.length} reviews)</span>
              </div>
              <span className="text-richblack-300">{studentsEnrolled.length} students enrolled</span>
              <span className="text-richblack-300">
                Created by: {instructor.firstName} {instructor.lastName}
              </span>
              <span className="text-richblack-300">Created at: {formatDate(createdAt)}</span>
              <span className="text-richblack-300">Language: English</span>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">What you'll learn</h2>
              <p className="text-richblack-100">{whatYouWillLearn}</p>
            </div>

            {/* Course Content */}
            <div>
              <div className="flex justify-between items-center mb-2 text-sm text-richblack-300">
                <span>{courseContent.length} section(s)</span>
                <span>{totalnumberlecture} lecture(s)</span>
                <span>{coursedata?.data?.totalDuration} total duration</span>
              </div>
              <button
                onClick={() => setactive([])}
                className="text-yellow-50 underline text-sm mb-4"
              >
                Collapse all sections
              </button>

              {/* Section list */}
              {courseContent.map((section, idx) => (
                <div key={section._id} className="mb-4">
                  <div
                    className="cursor-pointer bg-richblack-800 px-4 py-2 rounded-md flex justify-between"
                    onClick={() => handleactive(section._id)}
                  >
                    <h3 className="text-sm font-semibold">{section.sectionName}</h3>
                    <span>{isactive.includes(section._id) ? "-" : "+"}</span>
                  </div>
                  {isactive.includes(section._id) &&
                    section.subSection.map((sub, index) => (
                      <div key={index} className="ml-6 text-richblack-200 text-sm mt-1">
                        • {sub.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="lg:w-[600px]">
            <CourseDetailsCard
              course={coursedata.data.courseDetails}
              setConfirmationModal={setconfirmationmodal}
              handleCourse={handlecourse}
            />
          </div>
        </div>

        {confirmationmodal && <ConfirmationModal modalData={confirmationmodal} />}


        {/* <div  className="w-[1000px] mt-10"  >  */}


        {/* </div> */}






      </div>


      <Footer />
    </>







  );
};
