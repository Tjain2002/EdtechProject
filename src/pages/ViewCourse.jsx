import React, { useDebugValue, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
// import { getFullCourseDetails } from '../../server/controllers/Course';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import { VideoSidebar } from '../components/core/ViewSection/VideoSidebar';
import { CourseReview } from '../components/core/ViewSection/CourseReview';
export const ViewCourse = () => {

    const [ reviewmodal, setreviewmodal ] = useState(false);
    const{courseId} = useParams();
    const{token}= useSelector((state)=>state.auth);
    const dispatch= useDispatch();

    useEffect(()=>
    {

        const setcourserelateddetails = async()=>
        {
            const coursedata= await  getFullDetailsOfCourse(courseId,token);
            dispatch(setCourseSectionData(coursedata.courseDetails.courseContent))
              dispatch(setEntireCourseData(coursedata.courseDetails));
              dispatch(setCompletedLectures(coursedata.completedVideos));
              let lecture=0;
              coursedata?.courseDetails?.courseContent?.forEach((sec)=>
            {
                lecture= sec.subSection.length+lecture;

            })

            dispatch(setTotalNoOfLectures(lecture));

        }   
        setcourserelateddetails();
    },[])





    return (
        <div>
            <VideoSidebar setreviewmodal={setreviewmodal} />

            <div>


                <Outlet>

                </Outlet>




            </div>
    { reviewmodal&&<CourseReview  setreviewmodal={setreviewmodal}></CourseReview>}









        </div>
    )
}
