
import "./style.css";
import React from "react";
import {Folder, Arrow} from "../Icon";
import {TOnSelect} from "../type";

type TNode = {
    id: string,
    text: string,
    children?: TNode[],
    open?: boolean,
    redacted?: boolean,
    classified?: boolean,
}

interface IPropsNode {
    id: string,
    open: boolean,
    text: string,
    children: any[],
    onSelect: TOnSelect,
    selected?: string,
    redacted: boolean,
    classified: boolean,
}

interface IStateNode {
    open: boolean,
}

class Node extends React.Component<IPropsNode, IStateNode> {

    constructor(props: IPropsNode) {
        super(props);
        this.state = {open: props.open};
        this.toggle = this.toggle.bind(this);
    }

    toggle(e: React.SyntheticEvent) {
        this.setState(state => { return {open: !state.open} });
    }

    render() {
        const p = this.props;
        const s = this.state;
        const dir = !!p.children;
        const clsItem = ["item"];
        if (p.selected === p.id) {
            clsItem.push("selected");
        }
        if (p.redacted) {
            clsItem.push("redacted");
        }
        if (p.classified) {
            clsItem.push("classified");
        }
        const clsLi = [];
        if (s.open) {
            clsLi.push("open");
        }
        let tree = null;
        let handler;
        if (dir) {
            clsLi.push("dir");
            tree = <Tree
                notRoot={true}
                onSelect={p.onSelect}
                selected={p.selected}
                nodes={p.children}
                open={p.open}
            />
            handler = {onClick: this.toggle};
        } else {
            handler = !p.classified
                ? {onClick: (e: React.SyntheticEvent) => { p.onSelect(p.id) }}
                : {};
        }
        return (
            <li className={clsLi.join(" ")}>
                <div className={clsItem.join(" ")} {...handler}>
                    {dir ? <Folder/> : null}
                    <div className="text">{p.text}</div>
                    <div className="arrow"><Arrow/></div>
                </div>
                {tree}
            </li>
        );
    }
}

interface IPropsTree {
    notRoot?: boolean,
    onSelect: TOnSelect,
    selected?: string,
    nodes: any[],
    open: boolean,
}

function Tree(props: IPropsTree) {
    const p = props;
    const nodes = p.nodes.map(node => {
        // node = id, open, text, children, redacted
        return (
            <Node
                {...node}
                key={node.id}
                onSelect={p.onSelect}
                selected={p.selected}
                open={p.open}
            />
        );
    });
    const cls = p.notRoot ? ["tree"] : ["tree", "root"];
    return <ul className={cls.join(" ")}>{nodes}</ul>;
}

export default Tree;
export type {TNode};