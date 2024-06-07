import Cookies from 'js-cookie';

export const getToken = () => {
  const token = Cookies.get('x-access-token');
  if (token) return token;
  else return false;
};