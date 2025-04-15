
import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About FitFlow AI</h1>
      <div className="max-w-3xl">
        <p className="text-lg mb-6">
          FitFlow AI is your personal fitness companion that creates customized workout plans
          tailored to your goals, fitness level, and preferences.
        </p>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            To make personalized fitness accessible to everyone through AI-powered workout planning
            and progress tracking.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Share your fitness goals and preferences</li>
            <li>Get an AI-generated workout plan</li>
            <li>Track your progress and adjust as needed</li>
            <li>Achieve your fitness goals with personalized guidance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
