import {baseApi} from '..';
import { UserInterface } from '../../types/user';

const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await baseApi.post('/auth/request-reset-password', { email });
  } catch (error: any) {
    throw error;
  }
};

const verifyResetToken = async (token: string): Promise<{ email: string }> => {
  try {
    const response = await baseApi.post('/auth/verify-reset-token', { token });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const resetPassword = async (token: string, password: string): Promise<void> => {
  try {
    await baseApi.post('/auth/reset-password', { token, password });
  } catch (error: any) {
    throw error;
  }
};


const forgotPassword = async (email: string): Promise<string> => {
  try {
    const resposne = await baseApi.post('/auth/forgot-password', {email});
    return resposne.data.result.code;
  } catch (error: any) {
    throw error;
  }
};

const loginWithEmail=async(email:string,password:string):Promise<UserInterface>=>{
  try {
    const response = await baseApi.post('/auth/sign-in', { email, password });
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const registerWithEmail=async(data:{email:string,password:string,firstName:string,lastName:string}):Promise<any>=>{
  try {
    const response = await baseApi.post('/auth/sign-up', data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const isUserExist=async(email:string):Promise<boolean>=>{
  try {
    const response = await baseApi.post('/auth/check-email', { email });
    return response.data.exists;
  } catch (error: any) {
    throw error;
  }
}

export {
  forgotPassword,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  loginWithEmail,
  registerWithEmail,
  isUserExist
};
