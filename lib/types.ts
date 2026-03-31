export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export type SpeakingContext = "casual" | "interview" | "presentation" | "pitch";

export interface MetricResult {
  metric: string;
  value: number;
  score: number; // 0–10
  flag: string | null;
}

export interface Session {
  id: string;
  user_id: string;
  date: string;
  duration_seconds: number;
  context: SpeakingContext;
  topic: string | null;
  speakup_score: number;
  created_at: string;
  metrics?: MetricResult[];
  transcript?: string;
  filler_positions?: number[];
}

export interface WeeklySummary {
  id: string;
  user_id: string;
  week_start: string;
  avg_score: number;
  most_improved: string;
  top_flag: string;
  streak_status: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface APIError {
  detail: string;
}
