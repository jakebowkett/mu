
import "./style.css";
import { useEffect, useState } from "react";

function Bar({interval = 200}) {
    const [off, setOff] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            const n = Math.random() * 100;
            setOff((n + off/2) / 1.5);
        }, interval);
    }, [off]);
    return (
        <div className="bar">
            <div style={{width: `${off}%`}}></div>
        </div>
    );
}

export default Bar;