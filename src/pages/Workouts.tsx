
import React from 'react';

const Workouts = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Workout Programs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Strength Training</h2>
          <p className="text-gray-600 mb-4">Build muscle and increase strength with our comprehensive program.</p>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            View Program
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Weight Loss</h2>
          <p className="text-gray-600 mb-4">Effective cardio and strength workouts designed for fat loss.</p>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            View Program
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-3">Flexibility</h2>
          <p className="text-gray-600 mb-4">Improve mobility and reduce injury risk with targeted stretching.</p>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            View Program
          </button>
        </div>
      </div>
    </div>
  );
};

export default Workouts;
