
import "./style.css"
import Tree, { TNode } from '../Tree';
import Bar from '../Bar';
import { TOnSelect } from "../type";
import { findAncestor } from "../tool";

interface IPropSidebar {
    tree:      TNode[];
    onSelect:  TOnSelect;
    heading:   string;
    selected?: string;
}

function Sidebar(prop: IPropSidebar) {
    return (
        <div id="sidebar">
            <h1>{prop.heading}</h1>
            <Bar />
            <Bar />
            <div className="fader fade-bottom">
                <div id="file-picker" onScroll={filePickerScroll}>
                    <Tree
                        nodes={prop.tree}
                        open={true}
                        selected={prop.selected}
                        onSelect={prop.onSelect}
                    />
                </div>
            </div>
        </div>
    );
}

function filePickerScroll(e: React.SyntheticEvent) {
    const fp = e.target as Element;
    const off = fp.scrollTop;
    const end = fp.scrollHeight - fp.clientHeight;
    const fader = findAncestor(".fader", fp);
    if (off === 0) {
        fader.classList.remove("fade-top");
    } else {
        fader.classList.add("fade-top");
    }
    if (off >= end) {
        fader.classList.remove("fade-bottom");
    } else {
        fader.classList.add("fade-bottom");
    }
}

export default Sidebar;