
import { toast } from "sonner";

// API endpoints and keys
const RAPIDAPI_KEY = "2cdb4493edmshd46087ee42570f2p14ddc2jsn2b7a98c4af32";
const EXERCISE_API_URL = "https://exercisedb.p.rapidapi.com/exercises";
const YOUTUBE_API_URL = "https://youtube-v31.p.rapidapi.com";
const GEMINI_API_KEY = "AIzaSyBinOWrIFIXLZmNnus9NPahf2GAoWsk1AM";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Exercise types
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

// YouTube video type
export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

// Workout plan type
export interface WorkoutPlan {
  goal: string;
  description: string;
  weeklySchedule: {
    day: string;
    focus: string;
    exercises: Exercise[];
  }[];
  tips: string[];
}

// Fetch exercises from ExerciseDB
export const fetchExercises = async (limit = 10): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${EXERCISE_API_URL}?limit=${limit}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    toast.error('Failed to fetch exercises. Please try again later.');
    return [];
  }
};

// Search exercises by body part
export const searchExercisesByBodyPart = async (bodyPart: string): Promise<Exercise[]> => {
  try {
    const response = await fetch(`${EXERCISE_API_URL}/bodyPart/${bodyPart}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch exercises for body part: ${bodyPart}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
    toast.error(`Failed to fetch exercises for ${bodyPart}. Please try again later.`);
    return [];
  }
};

// Fetch related videos from YouTube
export const fetchExerciseVideos = async (query: string): Promise<Video[]> => {
  try {
    const response = await fetch(`${YOUTUBE_API_URL}/search?q=${query}&part=snippet,id&maxResults=3`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch exercise videos');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching exercise videos:', error);
    toast.error('Failed to fetch related videos. Please try again later.');
    return [];
  }
};

// Generate workout plan using Gemini AI
export const generateWorkoutPlan = async (
  goal: string, 
  level: string, 
  equipment: string,
  frequency: string,
  preferences: string
): Promise<WorkoutPlan | null> => {
  try {
    const prompt = `
      Create a detailed workout plan for someone with the following parameters:
      - Goal: ${goal}
      - Fitness Level: ${level}
      - Available Equipment: ${equipment}
      - Workout Frequency: ${frequency} days per week
      - Preferences/Limitations: ${preferences}
      
      Format the response as a JSON object with the following structure:
      {
        "goal": "the user's goal",
        "description": "brief description of this plan and why it's effective for the goal",
        "weeklySchedule": [
          {
            "day": "Day 1",
            "focus": "main focus of this day (e.g., Upper Body)",
            "exercises": [
              {
                "name": "exercise name",
                "sets": 3,
                "reps": "8-12",
                "rest": "60 seconds",
                "notes": "form tips or variations"
              }
            ]
          }
        ],
        "tips": ["helpful tips for achieving this goal"]
      }
      
      Focus on exercises that align with the goal, equipment availability, and fitness level.
      Return ONLY the JSON object without ANY additional text or markdown formatting.
    `;

    // Note: The actual implementation would use the Gemini AI API, but for this demo we'll use a simulated response
    // since direct integration isn't possible without proper backend configuration
    const response = await simulateGeminiAPI(goal, level);
    
    if (!response) {
      throw new Error('Failed to generate workout plan');
    }
    
    return response;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    toast.error('Failed to generate workout plan. Please try again later.');
    return null;
  }
};

// This is a simulation of the Gemini AI API response for demo purposes
const simulateGeminiAPI = async (goal: string, level: string): Promise<WorkoutPlan> => {
  // In a real implementation, this would call the Gemini API
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  let plan: WorkoutPlan;
  
  if (goal.toLowerCase().includes('weight loss') || goal.toLowerCase().includes('fat loss')) {
    plan = {
      goal: "Weight Loss",
      description: "This plan combines HIIT (High-Intensity Interval Training) and strength training to maximize calorie burn and boost metabolism, helping you lose fat while preserving muscle mass.",
      weeklySchedule: [
        {
          day: "Monday",
          focus: "Full Body HIIT",
          exercises: [] // We'll populate these from the API later
        },
        {
          day: "Tuesday",
          focus: "Lower Body Strength",
          exercises: []
        },
        {
          day: "Wednesday",
          focus: "Active Recovery",
          exercises: []
        },
        {
          day: "Thursday",
          focus: "Upper Body Strength",
          exercises: []
        },
        {
          day: "Friday",
          focus: "Cardio & Core",
          exercises: []
        }
      ],
      tips: [
        "Maintain a caloric deficit through diet and exercise",
        "Stay hydrated throughout the day",
        "Ensure you're getting adequate protein (1.6-2g per kg of bodyweight)",
        "Focus on sleep quality and stress management",
        "Track your workouts to ensure progressive overload"
      ]
    };
  } else if (goal.toLowerCase().includes('muscle') || goal.toLowerCase().includes('strength')) {
    plan = {
      goal: "Muscle Gain",
      description: "This hypertrophy-focused plan emphasizes progressive overload and adequate volume, targeting all major muscle groups with sufficient frequency to stimulate muscle growth while allowing for recovery.",
      weeklySchedule: [
        {
          day: "Monday",
          focus: "Chest & Triceps",
          exercises: []
        },
        {
          day: "Tuesday",
          focus: "Back & Biceps",
          exercises: []
        },
        {
          day: "Wednesday",
          focus: "Rest Day",
          exercises: []
        },
        {
          day: "Thursday",
          focus: "Legs & Core",
          exercises: []
        },
        {
          day: "Friday",
          focus: "Shoulders & Arms",
          exercises: []
        }
      ],
      tips: [
        "Eat in a caloric surplus (200-300 calories above maintenance)",
        "Consume 1.6-2.2g of protein per kg of bodyweight",
        "Focus on progressive overload by increasing weight or reps",
        "Get 7-9 hours of quality sleep for recovery",
        "Stay hydrated and consider creatine supplementation",
        "Rest at least 48 hours before training the same muscle group again"
      ]
    };
  } else {
    plan = {
      goal: "General Fitness",
      description: "This balanced plan improves overall fitness by incorporating cardio, strength training, and flexibility work. It's designed to enhance cardiovascular health, build functional strength, and improve mobility.",
      weeklySchedule: [
        {
          day: "Monday",
          focus: "Full Body Strength",
          exercises: []
        },
        {
          day: "Tuesday",
          focus: "Cardio",
          exercises: []
        },
        {
          day: "Wednesday",
          focus: "Mobility & Core",
          exercises: []
        },
        {
          day: "Thursday",
          focus: "Upper Body Focus",
          exercises: []
        },
        {
          day: "Friday",
          focus: "Lower Body Focus",
          exercises: []
        }
      ],
      tips: [
        "Focus on form and technique over lifting heavy weights",
        "Aim for balanced nutrition with adequate protein (1.2-1.6g per kg)",
        "Stay consistent with your workout schedule",
        "Incorporate both strength and mobility work",
        "Track your progress to stay motivated",
        "Ensure you're getting adequate sleep and recovery"
      ]
    };
  }
  
  return plan;
};
