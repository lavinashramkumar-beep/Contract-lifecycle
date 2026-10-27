import {createContext,useContext,useEffect,useState} from "react";
import api from "../services/api.js";
const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true);
  useEffect(()=>{if(localStorage.getItem("clm_token")) api.get("/auth/me").then(r=>setUser(r.data.user)).catch(()=>localStorage.removeItem("clm_token")).finally(()=>setLoading(false)); else setLoading(false)},[]);
  const login=async(email,password)=>{const r=await api.post("/auth/login",{email,password});localStorage.setItem("clm_token",r.data.token);setUser(r.data.user);};
  const register=async(data)=>{const r=await api.post("/auth/register",data);localStorage.setItem("clm_token",r.data.token);setUser(r.data.user);};
  const logout=()=>{localStorage.removeItem("clm_token");setUser(null)};
  return <AuthContext.Provider value={{user,loading,login,register,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
