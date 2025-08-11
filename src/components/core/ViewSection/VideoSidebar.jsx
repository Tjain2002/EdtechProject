import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

export const VideoSidebar = ({ setreviewmodal }) => {
    const [activestate, setactivestate] = useState("");
    const [videoactive, setvideoactive] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { sectionId, subSectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOdLectures,
        completedLectures
    } = useSelector((state) => state.viewCourse);

    useEffect(() => {
        if (!courseSectionData?.length) return;

        const currentSectionIndex = courseSectionData.findIndex(
            (data) => data._id === sectionId
        );

        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
            (data) => data._id === subSectionId
        );

        const activeSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id;

        setactivestate(courseSectionData?.[currentSectionIndex]?._id);
        setvideoactive(activeSubSectionId);
    }, [courseSectionData, courseEntireData, location.pathname]);

//     const handlereview = ()=>
//     {

//  console.log(" i am review modal");
//  return;
//     }



    return (
        <div className="text-richblack-5">
            {/* Header Section */}
            <div className="flex justify-between items-center p-4">
                <button
                    onClick={() => navigate("/dashboard/enrolled-courses")}
                    className="text-yellow-200 underline"
                >
                    Back
                </button>


            </div>

                <div>

                                <IconBtn
                                    text="Add Review"
                                    onclick={() =>    setreviewmodal(true)}
                                />
                            </div>












            {/* Course Info */}
            <div className="p-4 border-b border-richblack-700">
                <p className="text-lg font-semibold">{courseEntireData?.courseName}</p>
                <p className="text-sm text-richblack-300">
                    {completedLectures?.length}/{totalNoOdLectures} Lectures Completed
                </p>
            </div>

            {/* Sections & Subsections */}
            <div className="p-4 space-y-2">
                {
                    courseSectionData.map((section, sectionIndex) => (
                        <div key={section._id}>
                            {/* Section Name */}
                            <div
                                className="cursor-pointer py-2 font-semibold"
                                onClick={() => setactivestate(section._id)}
                            >
                                {section.sectionName}
                            </div>

                            {/* Subsections */}
                            {
                                activestate === section._id && (
                                    <div className="ml-4 space-y-2">
                                        {
                                            section.subSection.map((topic, topicIndex) => (
                                                <div
                                                    key={topic._id}
                                                    className={`flex items-center gap-4 p-3 rounded-md cursor-pointer transition-all 
                                                        ${videoactive === topic._id
                                                            ? "bg-yellow-200 text-richblack-900"
                                                            : "bg-richblack-900 text-richblack-5"
                                                        }`}
                                                    onClick={() => {
                                                        navigate(`/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`);
                                                        setvideoactive(topic._id);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={completedLectures.includes(topic._id)}
                                                        readOnly
                                                    />
                                                    <span>{topic.title}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }



                        
                        </div>










                    ))
                }
            </div>
        </div>
    );
}
