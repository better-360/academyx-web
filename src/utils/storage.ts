
const TOKEN_KEY = 'tokens';

export const getUserTokens = ()  => {
  const tokens = localStorage.getItem(TOKEN_KEY);
  return tokens ? JSON.parse(tokens) : null;
};

export const saveUserTokens = (tokens:any)=> {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const removeTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const clearStorage = (): void => {
  localStorage.clear();
};

export const setActiveCompanyId = (companyId: string): void => {
  localStorage.setItem('activeCompany', companyId);
};

export const getActiveCompanyId = (): string | null => {
  return localStorage.getItem('activeCompany');
};