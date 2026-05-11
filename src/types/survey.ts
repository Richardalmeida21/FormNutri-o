export interface Question {
  id: number;
  text: string;
  type: 'radio' | 'checkbox';
  options: string[];
  hasOther?: boolean;
}

export interface SurveyResponse {
  id?: string;
  created_at?: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string[];
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
}
