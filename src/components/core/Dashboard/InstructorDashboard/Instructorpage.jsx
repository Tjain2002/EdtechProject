import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { Link } from "react-router-dom";
import { InstructorChart } from "./InstructorChart";

export const Instructorpage = () => {
  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState([]);
  const [courses, setCourses] = useState([]);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const getCourseData = async () => {
      setLoading(true);
      const instructor = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);
      if (instructor) setInstructorData(instructor);
      if (result) setCourses(result);


      console.log("instructor data=", instructor)

      console.log("result data=", result)

      setLoading(false);
    };
    getCourseData();
  }, [token]);

  const totalAmtGenerate = instructorData?.reduce(
    (acc, curr) => acc + (Number(curr.price) || 0),
    0
  );

const totalStudents = courses.reduce(
  (acc, course) => acc + (courses?.studentsEnrolled?.length || 0),
  0
);




  console.log("length=",courses.studentsEnrolled?.length)
  // console.log(curr)



  // console.log("total student",curr.totalstudent)



  // console.log(instrc)
  console.log(totalAmtGenerate);
  console.log(totalStudents);

  console.log("courses",courses)




  return (
    <div className="text-richblack-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Hi {user?.firstName}</h1>
        <p>Let’s start your first beginning</p>
      </div>

      {loading ? (
        <div className="spinner">Loading...</div>
      ) : courses.length > 0 ? (
        <div className="flex flex-col gap-6">
          {/* Chart and Stats */}
          <div>
            <InstructorChart courses={instructorData} />

            <div className="mt-6">
              <p className="text-lg font-semibold">Statistics</p>
              <div className="flex gap-4 mt-2">
                <div>
                  <p>Total Courses</p>
                  <p>{courses.length}</p>
                </div>
                <div>
                  <p>Total Students</p>
                  {/* <p>{totalStudents}</p> */}
                  <p>{courses?.studentsEnrolled?.length || 0}</p>

                </div>
                <div>
                  <p>Total Amount</p>
                  <p>₹{totalAmtGenerate}</p>
                </div>
              </div>

              <div>

                
                



              </div>
              
            </div>
          </div>

          {/* Preview of Courses */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold">Your Courses</p>
              <Link to="/dashboard/my-courses" className="text-yellow-400 underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="bg-richblack-700 p-4 rounded">
                  <img
                    src={course.thumbnail}
                    alt="Course Thumbnail"
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="mt-2">
                    <p className="font-semibold">{course.courseName}</p>
                    <div className="flex justify-between text-sm mt-1">




                      <p>{course.studentsEnrolled.length === 0 ? 0 : course.studentsEnrolled.length}</p>

                      <p>₹{course.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>You have not created any courses yet.</p>
          <Link to="/dashboard/add-course" className="text-yellow-400 underline">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
};
