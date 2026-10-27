import {NavLink,Outlet,useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";
import {useEffect,useState} from "react";
import api from "../services/api.js";

const links=[
 ["Dashboard","/dashboard","▦"],["Contracts","/contracts","▤"],["Create Contract","/contracts/new","＋"],
 ["Approvals","/approvals","✓"],["Renewals","/renewals","↻"],["Vendors","/vendors","◈"],
 ["Compliance","/compliance","□"],["Reports","/reports","▥"],["Notifications","/notifications","●"]
];
export default function Layout(){
 const {user,logout}=useAuth(); const nav=useNavigate(); const [open,setOpen]=useState(false); const [unread,setUnread]=useState(0);
 useEffect(()=>{api.get("/notifications").then(r=>setUnread(r.data.filter(x=>!x.read).length)).catch(()=>{})},[]);
 return <div className="app-shell">
  <aside className={open?"sidebar open":"sidebar"}>
   <div className="brand"><div className="brand-mark">C</div><div><b>ContractFlow</b><small>Lifecycle Management</small></div></div>
   <nav>{links.map(([label,to,icon])=><NavLink onClick={()=>setOpen(false)} className={({isActive})=>isActive?"nav active":"nav"} to={to} key={to}><span>{icon}</span>{label}{label==="Notifications"&&unread>0?<em>{unread}</em>:null}</NavLink>)}</nav>
   {user?.role==="Admin"&&<NavLink className="nav admin-link" to="/users" onClick={()=>setOpen(false)}><span>♙</span>Users</NavLink>}
   <div className="side-bottom"><NavLink className="nav" to="/profile"><span>◉</span>Profile</NavLink><button className="logout" onClick={()=>{logout();nav("/login")}}>↪ Logout</button></div>
  </aside>
  <main className="main"><header className="topbar"><button className="hamburger" onClick={()=>setOpen(!open)}>☰</button><div><b>{user?.name}</b><span className="muted"> · {user?.role}</span></div><div className="top-actions"><span className="avatar">{user?.name?.[0]}</span></div></header><section className="content"><Outlet/></section></main>
 </div>
}
