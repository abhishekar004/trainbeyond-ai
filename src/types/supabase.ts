export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          user_id: string
          metadata: {
            exercise_count?: number
            last_performed?: string
            total_duration?: number
            workoutsPerWeek?: number
            duration?: string
            level?: string
            imageUrl?: string
            schedule?: Array<{
              day: string
              focus: string
              exercises: Array<{
                id?: string
                name: string
                bodyPart: string
                equipment: string
                target: string
                gifUrl: string
                instructions: string
                sets?: number
                reps?: number
              }>
            }>
          } | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          user_id: string
          metadata?: {
            exercise_count?: number
            last_performed?: string
            total_duration?: number
            workoutsPerWeek?: number
            duration?: string
            level?: string
            imageUrl?: string
            schedule?: Array<{
              day: string
              focus: string
              exercises: Array<{
                id?: string
                name: string
                bodyPart: string
                equipment: string
                target: string
                gifUrl: string
                instructions: string
                sets?: number
                reps?: number
              }>
            }>
          } | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          user_id?: string
          metadata?: {
            exercise_count?: number
            last_performed?: string
            total_duration?: number
            workoutsPerWeek?: number
            duration?: string
            level?: string
            imageUrl?: string
            schedule?: Array<{
              day: string
              focus: string
              exercises: Array<{
                id?: string
                name: string
                bodyPart: string
                equipment: string
                target: string
                gifUrl: string
                instructions: string
                sets?: number
                reps?: number
              }>
            }>
          } | null
        }
      }
      workout_completions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          workout_id: string
          completed_at: string
          duration_minutes: number
          difficulty_rating: number
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          workout_id: string
          completed_at?: string
          duration_minutes: number
          difficulty_rating: number
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          workout_id?: string
          completed_at?: string
          duration_minutes?: number
          difficulty_rating?: number
          notes?: string | null
        }
      }
      exercise_progress: {
        Row: {
          id: string
          created_at: string
          user_id: string
          exercise_id: string
          workout_completion_id: string
          sets: number
          reps: number
          weight: number | null
          duration_seconds: number | null
          recorded_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          exercise_id: string
          workout_completion_id: string
          sets: number
          reps: number
          weight?: number | null
          duration_seconds?: number | null
          recorded_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          exercise_id?: string
          workout_completion_id?: string
          sets?: number
          reps?: number
          weight?: number | null
          duration_seconds?: number | null
          recorded_at?: string
          notes?: string | null
        }
      }
      user_exercise_logs: {
        Row: {
          id: string
          created_at: string
          workout_id: string
          exercise_id: string
          sets: number
          reps: number
          weight: number | null
          duration: number | null
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          workout_id: string
          exercise_id: string
          sets: number
          reps: number
          weight?: number | null
          duration?: number | null
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          workout_id?: string
          exercise_id?: string
          sets?: number
          reps?: number
          weight?: number | null
          duration?: number | null
          user_id?: string
        }
      }
      exercises: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          body_part: string
          equipment: string | null
          difficulty_level: string
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          body_part: string
          equipment?: string | null
          difficulty_level: string
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          body_part?: string
          equipment?: string | null
          difficulty_level?: string
          image_url?: string | null
        }
      }
    }
  }
} 