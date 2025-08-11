import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form';
import RatingStars from '../../common/RatingStars';
// import ReactStars from 'react-rating-stars-component'
import ReactStars from 'react-rating-stars-component'
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

export const CourseReview = ({ setreviewmodal }) => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { handleSubmit, register, setValue, getValues, formState: { errors } } = useForm();
    const { courseEntireData } = useSelector((state) => state.viewCourse);

    const ratingchange = (newRating) => {
        setValue("courseRating", newRating);
    }


    useEffect(() => {

        setValue("review", "");
        setValue("courseRating", 0);
    }, [])

    const onSubmit = async (data) => {


        await createRating(


            {
                courseId: courseEntireData._id,
                rating: data.courseRating,
                review: data.review,
            },
            token
        )
        setreviewmodal(false)

    }



    return (
        <div  className='text-white' >


            <div>


                <div>
                    {/* modal header */}
                    <div>
                        <p>Add Review</p>
                        <button onClick={()=>setreviewmodal(false)}>
                            close


                        </button>
                    </div>


                    {/* modal data */}
                    <div>
                        <div>

                            <img src={user?.image} alt='user image'
                                className='aspect-square w-[50px] rounded-full'

                            >

                            </img>
                        </div>

                        <div>
                            <p>{user?.firstName} {user?.lastName}</p>
                            <p>Posting publically</p>
                        </div>





                    </div>


                    <form onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col'


                    >

                        {/* <RatingStars  ></RatingStars>
                     */}
                        <ReactStars count={5}
                            onChange={ratingchange}

                            size={24}
                            activeColor="#ffd700"


                        >

                        </ReactStars>


                        <div>

                            <label htmlFor='review'>Add Your Experience</label>
                            <textarea id='review' placeholder='Add your Experience here'
                                {...register("review", { required: true })}
                                className='form-style min-h-[130px] w-full'

                            ></textarea>


                            {
                                errors.review && (



                                    <span>
                                        please add your experience
                                    </span>
                                )
                            }
                        </div>



                        <div>




                            {/* cancel button and save button */}

                            <button onClick={() => setreviewmodal(false)} >

                                Cancel

                            </button>

<IconBtn text="Save" onclick={handleSubmit(onSubmit)} />




                        </div>





                    </form>
                </div>
            </div>




        </div>
    )
}
