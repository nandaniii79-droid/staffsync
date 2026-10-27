import { createContext, useContext, useState } from 'react';
import api from '../api';

const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ss_user') || 'null'));

  const authenticate = async (mode, body) => {
    const { data } = await api.post(`/auth/${mode}`, body);
    localStorage.setItem('ss_token', data.token);
    localStorage.setItem('ss_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('ss_token');
    localStorage.removeItem('ss_user');
    setUser(null);
  };

  return <Ctx.Provider value={{ user, authenticate, logout }}>{children}</Ctx.Provider>;
}