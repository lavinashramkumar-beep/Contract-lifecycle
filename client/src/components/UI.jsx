export function Card({title,value,sub,icon}){return <div className="stat-card"><div className="stat-icon">{icon}</div><div><div className="muted">{title}</div><h2>{value}</h2>{sub&&<small>{sub}</small>}</div></div>}
export function Badge({children}){const key=String(children||"").toLowerCase().replaceAll(" ","-");return <span className={`badge ${key}`}>{children}</span>}
export function Empty({text="No records found"}){return <div className="empty">{text}</div>}
export function Loader(){return <div className="loading">Loading...</div>}
