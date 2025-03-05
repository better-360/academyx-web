import { AddQuestionsType } from "../../types";
import instance from "../instance";

export const getAllSurveys = async () => {
  try {
    const response = await instance.get(`admin/surveys/all`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getSurvey = async (id:string) => {
  try {
    const response = await instance.get(`admin/surveys/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const createSurvey = async (data: {
  title: string;
  description: string;
}) => {
  try {
    const response = await instance.post("admin/surveys/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSurvey = async (surveyId: string, data: any) => {
  try {
    const response = await instance.patch(`admin/surveys/${surveyId}/update`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteSurvey = async (surveyId: string) => {
  try {
    const response = await instance.delete(`/surveys/${surveyId}/delete`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const addQuestionsToSurvey = async (data: AddQuestionsType) => {
  try {
    const response = await instance.post(`/surveys/add-questions`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};



export const getSurveyResults = async (customSurveyId: string) => {
  try {
    const response = await instance.get(`admin/surveys/${customSurveyId}/results`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


export const getAllResults = async () => {
  try {
    const response = await instance.get(`admin/surveys/results`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};





export const getAllCustomSurveys = async () => {
  try {
    const response = await instance.get(`admin/surveys/custom/all`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCustomSurvey = async (id:string) => {
  try {
    const response = await instance.get(`admin/surveys/custom/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createCustomSurvey = async (data: any) => {
  try {
    const response = await instance.post("admin/surveys/custom/generate", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCustomSurvey = async (surveyId: string, data: any) => {
  try {
    const response = await instance.patch(
      `admin/surveys/custom/${surveyId}/update`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteCustomSurvey = async (surveyId: string) => {
  try {
    const response = await instance.delete(
      `admin/surveys/custom/${surveyId}/delete`
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};




export const createCompany = async (data:any) => {
  try {
    const response = await instance.post(`admin/companies/create`, data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAllCompanines = async () => {
  try {
    const response = await instance.get("admin/companies/get-all");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCompanyDetails = async (companyId: string) => {
  try {
    const response = await instance.get(`admin/companies/${companyId}/details`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateCompany = async (companyId: string, data: any) => {
  try {
    const response = await instance.patch(
      `admin/companies/${companyId}/update/`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateCompanyStatus = async (
  companyId: string,
  status: boolean
) => {
  try {
    const response = await instance.patch(
      `/companies/${companyId}/update-status`,
      status
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteCompany = async (companyId: string) => {
  try {
    const response = await instance.delete(`/companies/${companyId}delete`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getCompanyCustomSurveys = async (companyId: string): Promise<any> => {
  try {
    const response = await instance.get(`admin/companies/${companyId}/surveys`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching details:", error);
    throw error;
  }
};

export const getCompanyUsers = async (companyId: string): Promise<any> => {
  try {
    const response = await instance.get(`admin/companies/${companyId}/users`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

  export const addCompanyUser = async (companyId:string,data:any) =>
    {
      try {
        const response = await instance.post(`admin/companies/${companyId}/add-personnel`,data);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    }

    export const deleteCompanyUser= async (personelId: string) => {
      try {
        const response = await instance.delete(`/companies/delete-personnel/${personelId}`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    };
    
  export const updateCompanyUser=async (personelId:string,data:any)=> {
    try {
      const response = await instance.patch(`/companies/update-personnel/${personelId}`,data);
      return response.data;
    }
    catch (error: any) {
      throw error;
    }
  }


