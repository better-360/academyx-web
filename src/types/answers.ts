export interface SubmitResponseItem {
    customSurveyQuestionId: string
    selectedOption: string;
  }

  export interface SubmitResponse {
    customSurveyId?: string;
    responses: SubmitResponseItem[];
  }