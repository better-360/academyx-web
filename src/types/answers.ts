export interface SubmitResponseItem {
    customSurveyQuestionId?: string
    managerSurveyQuestionId?: string;
    selectedOption: string;
  }

  export interface SubmitResponse {
    customSurveyId?: string;
    managerSurveyId?: string;
    responses: SubmitResponseItem[];
  }