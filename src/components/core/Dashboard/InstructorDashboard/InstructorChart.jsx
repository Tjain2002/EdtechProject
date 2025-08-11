import React, { useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { Pie, PolarArea } from 'react-chartjs-2';

Chart.register(...registerables);

export const InstructorChart = ({ courses }) => {
  const [currentChart, setCurrentChart] = useState("students");

  // Function to generate random colors
  const getRandomColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, 
                         ${Math.floor(Math.random() * 256)}, 
                         ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };

  // Data for students chart
  const studentChartData = {
    labels: courses.map((course) => course.courseName),
    datasets: [{
      data: courses.map((course) => course.studentsEnrolled?.length || 0),
      backgroundColor: getRandomColors(courses.length),
    }],
  };

  // Data for income chart
  const incomeChartData = {
    labels: courses.map((course) => course.courseName),
    datasets: [{
      data: courses.map((course) => course.price || 0),
      backgroundColor: getRandomColors(courses.length),
    }],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: currentChart === "students" ? "Students Enrolled per Course" : "Income per Course",
        color: '#fff',
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div className="bg-richblack-800 p-4 rounded-lg">
      <p className="text-lg font-bold text-white mb-2">Visualize</p>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${currentChart === "students" ? "bg-yellow-400" : "bg-richblack-600"}`}
          onClick={() => setCurrentChart("students")}
        >
          Students
        </button>
        <button
          className={`px-4 py-2 rounded ${currentChart === "income" ? "bg-yellow-400" : "bg-richblack-600"}`}
          onClick={() => setCurrentChart("income")}
        >
          Income
        </button>
      </div>

      <div className="max-w-[500px] mx-auto">
        <PolarArea
          data={currentChart === "students" ? studentChartData : incomeChartData}
          options={options}
        />
      </div>
    </div>
  );
};
