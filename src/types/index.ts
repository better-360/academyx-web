export interface Question {
    text: string;
    options: string[];
  }
  
export interface AddQuestionsType {
    surveyId: string;
    questions: Question[];
  }