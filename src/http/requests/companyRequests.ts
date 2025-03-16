import instance from "../instance"
import { getActiveCompanyId } from "../../utils/storage";


  
export const getMyCompanySurveys = async () =>
  {
    try {
     const companyId=getActiveCompanyId();
      const response = await instance.get(`/companies/${companyId}/surveys`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }


  export const getMyCompanySurveyResults = async (customSurveyId:string) =>
    {
      try {
        const response = await instance.get(`/surveys/${customSurveyId}/results`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    }


export const getCompanyMyDetails = async (companyId?: string): Promise<any> => {
  try {
    // companyId parametresi varsa onu, yoksa localStorage'dan alınan değeri kullanın.
    const currentId = companyId || getActiveCompanyId();
    const response = await instance.get(`/companies/${currentId}/details`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};


export const updateMyCompany = async (companyId: string, data: any): Promise<any> => {
  try {
    // companyId parametresi varsa onu, yoksa localStorage'dan alınan değeri kullanın.
    const currentId = companyId || getActiveCompanyId();
    const response = await instance.patch(`/companies/${currentId}/update/`,data
    );    return response.data;
  } catch (error: any) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};


export const getMyPersonnels = async (companyId?: string): Promise<any> => {
  try {
    // companyId parametresi varsa onu, yoksa localStorage'dan alınan değeri kullanın.
    const currentId = companyId || getActiveCompanyId();
    const response = await instance.get(`/companies/${currentId}/users`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

  export const addPersonnel = async (data:any) =>
    {
      try {
        const companyId = getActiveCompanyId();
        const response = await instance.post(`/companies/${companyId}/add-personnel`,data);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    }


    export const deletePersonnel = async (personelId: string) => {
      try {
        const response = await instance.delete(`/companies/delete-personnel/${personelId}`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    };
    

  export const updateMyPersonnnel=async (personelId:string,data:any)=> {
    try {
      const response = await instance.patch(`/companies/update-personnel/${personelId}`,data);
      return response.data;
    }
    catch (error: any) {
      throw error;
    }
  }


  export const getCustomSurvey = async (surveyId:string) =>
    {
      try {
        const response = await instance.post(`/surveys/custom/${surveyId}`);
        return response.data;
      } catch (error: any) {
        throw error;
      }
    }

  export const getManagerSurvey = async (surveyId:string) =>
      {
        try {
          const response = await instance.post(`/surveys/custom/${surveyId}`);
          return response.data;
        } catch (error: any) {
          throw error;
        }
      }