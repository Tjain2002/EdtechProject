import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { GiPlayButton } from "react-icons/gi";
import { Player } from 'video-react';
import IconBtn from '../../common/IconBtn';

export const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playref = useRef();
    const { token } = useSelector((state) => state.auth);
    const { courseSectionData, courseEntireData, completedLectures } = useSelector((state) => state.viewCourse);

    const [videodata, setvideodata] = useState(null);
    const [videoEnded, setVideoend] = useState(false);
    const [loading, setloading] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!courseSectionData.length) return;

            if (!courseId || !sectionId || !subSectionId) {
                navigate("/dashboard/enrolled-courses");
                return;
            }

            const section = courseSectionData.find(course => course._id === sectionId);
            const subSection = section?.subSection.find(item => item._id === subSectionId);

            if (subSection) {
                setvideodata(subSection);
                setVideoend(false);
            }
        };

        fetchVideoData();
    }, [courseSectionData, courseEntireData, location.pathname]);

    const isFirstVideo = () => {
        const sectionIndex = courseSectionData.findIndex(data => data._id === sectionId);
        const subSectionIndex = courseSectionData[sectionIndex]?.subSection.findIndex(data => data._id === subSectionId);

        return sectionIndex === 0 && subSectionIndex === 0;
    };

    const isLastVideo = () => {
        const sectionIndex = courseSectionData.findIndex(data => data._id === sectionId);
        const subSectionIndex = courseSectionData[sectionIndex]?.subSection.findIndex(data => data._id === subSectionId);

        return (
            sectionIndex === courseSectionData.length - 1 &&
            subSectionIndex === courseSectionData[sectionIndex].subSection.length - 1
        );
    };

    const gotonextvideo = () => {
        const sectionIndex = courseSectionData.findIndex(data => data._id === sectionId);
        const subSectionIndex = courseSectionData[sectionIndex]?.subSection.findIndex(data => data._id === subSectionId);

        if (subSectionIndex < courseSectionData[sectionIndex].subSection.length - 1) {
            const nextSubSectionId = courseSectionData[sectionIndex].subSection[subSectionIndex + 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        } else if (sectionIndex < courseSectionData.length - 1) {
            const nextSectionId = courseSectionData[sectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[sectionIndex + 1].subSection[0]._id;
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`);
        }
    };

    const gotoprev = () => {
        const sectionIndex = courseSectionData.findIndex(data => data._id === sectionId);
        const subSectionIndex = courseSectionData[sectionIndex]?.subSection.findIndex(data => data._id === subSectionId);

        if (subSectionIndex > 0) {
            const prevSubSectionId = courseSectionData[sectionIndex].subSection[subSectionIndex - 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        } else if (sectionIndex > 0) {
            const prevSectionId = courseSectionData[sectionIndex - 1]._id;
            const prevSubLen = courseSectionData[sectionIndex - 1].subSection.length;
            const prevSubSectionId = courseSectionData[sectionIndex - 1].subSection[prevSubLen - 1]._id;
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`);
        }
    };

    const handlecomplete = async () => {
        setloading(true);
        const res = await markLectureAsComplete({ courseId, subSectionId }, token);

        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setloading(false);
    };

    return (
        <div className='text-richblack-5'>
            {!videodata ? (
                <div>No data found</div>
            ) : (
                <Player
                    ref={playref}
                    aspectRatio='16:9'
                    playsInline
                    onEnded={() => setVideoend(true)}
                    src={videodata?.videoUrl}
                >
                    <GiPlayButton className='mx-auto items-center' />

                    {videoEnded && (
                        <div className='mt-4'>
                            {!completedLectures.includes(subSectionId) && (
                                <IconBtn
                                    disabled={loading}
                                    onclick={handlecomplete}
                                    text={!loading ? "Mark as Completed" : "Loading..."}
                                />
                            )}

                            <IconBtn
                                disabled={loading}
                                onclick={() => {
                                    if (playref?.current) {
                                        playref.current.seek(0);
                                        setVideoend(false);
                                    }
                                }}
                                text="Rewatch"
                                customClasses="text-xl"
                            />

                            <div className='flex gap-4 mt-4'>
                                {!isFirstVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={gotoprev}
                                        className='blackButton'
                                    >
                                        Prev
                                    </button>
                                )}

                                {!isLastVideo() && (
                                    <button
                                        disabled={loading}
                                        onClick={gotonextvideo}
                                        className='blackButton'
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </Player>
            )}

            <h1>{videodata?.title}</h1>
            <p>{videodata?.description}</p>
        </div>
    );
};
