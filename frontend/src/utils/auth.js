const parseStoredUser = () => {
  const user = localStorage.getItem('user');

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

export const isAuthenticated = () => !!localStorage.getItem('token');

export const isAdmin = () => {
  return parseStoredUser()?.role === 'admin';
};

export const getUser = () => parseStoredUser();

export const getToken = () => localStorage.getItem('token');
