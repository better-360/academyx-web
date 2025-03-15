export interface ICompany {
    id: string;
    name: string;
    email: string;
    address: string;
    isActive: boolean;
    phone: string;
    sector: string;
    size: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null; // Silinmişse null olabilir
    active: boolean;
  }
  
  export interface ICustomSurveyQuestion {
    id: string;
    customSurveyId: string;
    text: string;
    options: string[];
  }
  
  export interface ICustomSurvey {
    id: string;
    title: string;
    description: string;
    companyId: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    company: ICompany;
    questions: ICustomSurveyQuestion[];
  }
  