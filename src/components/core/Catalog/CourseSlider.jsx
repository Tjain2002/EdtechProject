import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper';
import Course_Card from './Course_Card';

const CourseSlider = ({ Courses }) => {
  return (
    <div className="w-full mt-6">
      {
        Courses?.length ? (
          <Swiper
            loop={true}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, FreeMode, Pagination, Navigation]}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="mySwiper"
          >
            {
              Courses.map((course, index) => (
                <SwiperSlide key={index} className="flex justify-center">
                  <Course_Card course={course} Height="h-[250px]" />
                </SwiperSlide>
              ))
            }
          </Swiper>
        ) : (
          <p className="text-richblack-300 text-lg text-center py-8">No Courses Found</p>
        )
      }
    </div>
  );
};

export default CourseSlider;
