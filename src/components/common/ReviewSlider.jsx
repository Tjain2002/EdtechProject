import React, { useEffect, useState } from 'react'

// import {swiper}
import { FaStar } from 'react-icons/fa'

import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper'
import ReactStars from 'react-rating-stars-component'
import { ratingsEndpoints } from '../../services/apis'
import { apiConnector } from '../../services/apiconnector'
import { FaStarHalfAlt } from 'react-icons/fa'



export const ReviewSlider = () => {


    const [review, setreview] = useState([]);
    const truncatewords = 35;

    useEffect(() => {

        const allreviews = async () => {
            const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
            console.log("review response" + data);

            if (data?.success) {
                setreview(data?.data);
            }


            console.log("printing reviews" + review);





        }
        allreviews();


    }, [])


    // useEffect








    return (
        <div className=' text-richblack-5  mx-auto mb-10 rounded-sm items-center justify-center pl-10'  >

            <div className='  lg:flex h-[190px] max-w-maxContent ' >

                <Swiper
                    slidesPerView={4}
                    spaceBetween={24}
                    loop={true}
                    freeMode={true}
                    autoplay={
                        {
                            delay: 250,

                        }
                    }

                    modules={[FreeMode, Pagination, Autoplay]}

                    className='w-full'


                >
                    {
                        review.map((reviewdata, index) => (
                            <SwiperSlide
                                key={index}

                            >

                                <div className='flex flex-col gap-2 mt-5 bg-richblack-800 h-[200px]  rounded-md '>
 



<div  className='flex gap-5 mt-5 ' >

                  <img
                                        src={reviewdata?.user?.image ? reviewdata?.user?.image
                                            :
                                            `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}

                                        className='h-9 w-9 object-cover rounded-full ml-4'>



                                    </img>
                                    <div className='flex flex-col' >

                                        <div className='flex flex-row gap-3' >
                                            <p className='text-richblack-5 flex' >{reviewdata?.user?.firstName}  </p>
                                            <p>{reviewdata?.user?.lastName}</p>
                                        </div>




                                        <p className='text-richblack-400' >{reviewdata?.course?.courseName}</p>


                                    </div>










</div>

       

                  
                                    <p className='pl-10' >{reviewdata?.review}</p>

                                    <div className='flex w-[500px] gap-4 pl-10 ' >



                                        <p className='text-yellow-100  mt-1' >{reviewdata?.rating.toFixed(1)}</p>
                                        <ReactStars count={5} value={reviewdata.rating}


                                            size={20}
                                            edit={false}
                                            // emptyIcon={<FaStar />}
                                            filledIcon={<FaStar />}
                                            activeColor="#ffd700"
                                            classNames={"w-full"}

                                        ></ReactStars>
                                    </div>





                                </div>









                                {/* <p></p>


*/}

                                {/* <React ></React>
 */}


                            </SwiperSlide>
                        ))
                    }






                </Swiper>
            </div>








        </div>
    )
}
