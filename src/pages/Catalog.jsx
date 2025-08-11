import React, { useEffect, useState } from 'react';
import Footer from '../components/common/Footer';
import { useParams } from 'react-router-dom';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';

const Catalog = () => {
  const { catalogName } = useParams();
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");

  // Fetch all categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        const allCategories = res?.data?.data || [];

        const matchedCategory = allCategories.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        );

        if (!matchedCategory) {
          console.error("No matching category found for:", catalogName);
          return;
        }

        setCategoryId(matchedCategory._id);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, [catalogName]);

  // Fetch category page data
  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        const res = await getCatalogaPageData(categoryId);
        setCatalogPageData(res);
      } catch (error) {
        console.log("Error fetching catalog page data:", error);
      }
    };

    if (categoryId) {
      getCategoryDetails();
    }
  }, [categoryId]);

  return (


    <>

     <div className="flex flex-col min-h-screen bg-richblack-900 text-white px-4 md:px-12 lg:px-24 py-12">
      {/* Breadcrumb */}
      <nav className="text-richblack-400 text-sm mb-6">
        Home / Catalog / <span className="text-richblack-100 font-semibold">{catalogPageData?.selectedCategory?.name || 'Loading...'}</span>
      </nav>

      {/* Title and Description */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          {catalogPageData?.selectedCategory?.name || 'Loading...'}
        </h1>
        <p className="text-richblack-300 max-w-3xl">
          {catalogPageData?.selectedCategory?.description}
        </p>
      </header>

      {/* Section 1: Courses to get started */}
      <section className="mb-16">
        <h2 className="text-3xl text-richblack-200 font-semibold mb-6">
          Courses to get you started
        </h2>

        <div className="flex gap-6 text-richblack-400 font-medium mb-8">
          <button className="px-4 py-2 rounded-md bg-richblack-700 hover:bg-richblack-600 transition">
            Most Popular
          </button>
          <button className="px-4 py-2 rounded-md bg-transparent border border-richblack-600 hover:border-richblack-400 transition">
            New
          </button>
        </div>

        <CourseSlider Courses={catalogPageData?.selectedCategory?.courses} />
      </section>

      {/* Section 2: Top courses in category */}
      <section className="mb-16">
        <h2 className="text-3xl text-richblack-200 font-semibold mb-6">
          Top Courses in {catalogPageData?.selectedCategory?.name}
        </h2>

        <CourseSlider Courses={catalogPageData?.differentCategory?.courses} />
      </section>

      {/* Section 3: Frequently Bought */}
      <section className="mb-20">
        <h2 className="text-3xl text-richblack-200 font-semibold mb-8">
          Frequently Bought
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {catalogPageData?.data?.mostSellingCourses?.slice(0, 4).map((course, idx) => (
            <Course_Card course={course} key={idx} Height={"h-[400px]"} />
          ))}
        </div>
      </section>

     
    </div>

 <Footer />

    </>
   
  );
};

export default Catalog;
