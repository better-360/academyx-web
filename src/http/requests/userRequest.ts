import {axiosInstance} from '..';

const getUserData = async (): Promise<any> => {
  try {
    const repsonse = await axiosInstance.get('/users/me');
    return repsonse.data;
  } catch (error: any) {
    throw error;
  }
};


export {getUserData}