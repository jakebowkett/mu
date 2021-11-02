
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Viewer from "../Viewer";
import Range from "../Range";
import Map from "../Map";
import { fileList } from "../data";
import { q } from "../tools";
import "./style.css";

function App() {
    const heading = "Access Terminal Mu";
    const [ fileId, setFileId ] = useState<string | undefined>();
    const [ fileData, setFileData ] = useState<string | undefined>();
    const [ offPc, setOffPc ] = useState(0);
    const [ offEnd, setOffEnd ] = useState(false);
    const select = makeSelect(setFileId, setFileData, setOffPc, setOffEnd);
    useEffect(() => {
        function popState(e: PopStateEvent) { select(e.state.id, true); }
        function scroll() { setScroll(setOffPc, setOffEnd); }
        window.addEventListener("popstate", popState);
        window.addEventListener("resize", scroll);
        window.addEventListener("scroll", scroll);
        return () => {
            window.removeEventListener("popstate", popState);
            window.removeEventListener("resize", scroll);
            window.removeEventListener("scroll", scroll);
        };
    });
    return (
        <div id="app">
            <Sidebar
                tree={fileList}
                heading={heading}
                selected={fileId}
                onSelect={select}
            />
            <div id="dummy-heading">{heading}</div>
            <Viewer
                id="viewer"
                file={fileData}
                onRemove={select}
            />
            <Range
                id="range"
                reverse={true}
                offPc={offPc}
                offEnd={offEnd}
            />
            <div id="screens">
                <Map/>
            </div>
        </div>
    );
}

function makeSelect(
    setFileId:   (id: string | undefined) => void,
    setFileData: (id: string | undefined) => void,
    setOffPc:    (n: number)  => void,
    setOffEnd:   (b: boolean) => void,
) {
    return (id: string | null, suppressHistory?: boolean) => {
        if (!id) {
            if (!suppressHistory) {
                window.history.pushState({id: undefined}, "", `${PATH_PREFIX}/`);
            }
            setFileId(undefined);
            setFileData(undefined);
            return;
        }
        if (!suppressHistory) {
            window.history.pushState({id: id}, "", `${PATH_PREFIX}/${id}`);
        }
        setFileId(id);
        setFileData(`<div class="loading">Loading...</div>`);
        fetch(`${PATH_PREFIX}/content/${id}.html`)
            .then((res) => {
                return res.text();
            })
            .then((text) => {
                setFileId(id);
                setFileData(text);
                window.requestAnimationFrame(() => {
                    setScroll(setOffPc, setOffEnd);
                });
            });
    };
}

function setScroll(
    setOffPc:  (n: number) => void,
    setOffEnd: (b: boolean) => void,
) {
    const track = q("#range .track") as Element;
    const drag = q("#range .dragger") as Element;
    const off = window.scrollY;
    const h = document.documentElement.scrollHeight;
    const range = h - window.innerHeight
    const fr = (range === 0 ? 0 : off / range);
    const dragOff = (track.clientHeight - drag.clientHeight) * fr;
    const dragFr = dragOff / track.clientHeight;
    setOffPc(dragFr * 100);
    setOffEnd(fr > 0.9);
}

export default App;