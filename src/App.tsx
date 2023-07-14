import './App.css'
import SideBar from "./components/SideBar.tsx";
import {useState} from "react";

function App() {
    const [open, setOpen] = useState<boolean>(window.localStorage.getItem('SIDEBAR_OPEN') === 'true');
    const onClick = () => {
        const newState = !open;
        setOpen(!open);
        window.localStorage.setItem('SIDEBAR_OPEN', String(newState));
    }
    return (
        <>
            <div className="home">
                <button className="explore-button" onClick={onClick}>Explore web APIs</button>
            </div>
            {open ? <SideBar onBackdropClick={onClick}></SideBar> : null}
        </>
    )
}

export default App
