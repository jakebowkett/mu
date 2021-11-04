
import "./style.css";
import CONTENT_MAPPING from "../../content/import";
import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Viewer from "../Viewer";
import Range from "../Range";
import Map from "../Map";
import { fileList } from "../data";
import { q } from "../tool";
import {
    TOnSelect,
    TSetOffPc,
    TSetOffEnd,
    TSetFileId,
    TSetFileData,
} from "../type";

function App() {

    const heading = "Access Terminal Mu";
    const [ fileId, setFileId ] = useState<string | undefined>();
    const [ fileData, setFileData ] = useState<string | undefined>();
    const [ offPc, setOffPc ] = useState(0);
    const [ offEnd, setOffEnd ] = useState(false);
    const select = makeSelect(setFileId, setFileData, setOffPc, setOffEnd);

    // Supplying useEffect with an empty array ensures it only runs once.
    useEffect(setupAndCleanup(setOffPc, setOffEnd, select), []);

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

/* 
    The return value of setupAndCleanup is supplied as an
    argument to useEffect in the App component.

    We return an anonymous arrow function because useEffect
    is meant to have a new function each time it's called.
    This way we guarantee any values we may decide to pass
    in the future don't get stale.
*/
function setupAndCleanup(
    setOffPc:  TSetOffPc,
    setOffEnd: TSetOffEnd,
    select:    TOnSelect,
): () => void {

    // Setup.
    return () => {
        
        // Setup event listeners.
        function popState(e: PopStateEvent) { select(e.state.id, true); }
        function scroll() { setScroll(setOffPc, setOffEnd); }
        window.addEventListener("popstate", popState);
        window.addEventListener("resize", scroll);
        window.addEventListener("scroll", scroll);

        // Add approriate history object and load correct view.
        const path = window.location.pathname.slice(PATH_PREFIX.length);
        let id = null;
        if (path.length > 1) {
            id = path.slice(1);
            select(id, true);
        }
        window.history.replaceState({id: id}, "", window.location.pathname);

        // Cleanup.
        return () => {

            // Cleanup event listeners.
            window.removeEventListener("popstate", popState);
            window.removeEventListener("resize", scroll);
            window.removeEventListener("scroll", scroll);
        };
    };
}

function makeSelect(
    setFileId:   TSetFileId,
    setFileData: TSetFileData,
    setOffPc:    TSetOffPc,
    setOffEnd:   TSetOffEnd,
): TOnSelect {
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
        fetch(`${PATH_PREFIX}${CONTENT_MAPPING[id]}`)
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
    setOffPc:  TSetOffPc,
    setOffEnd: TSetOffEnd,
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