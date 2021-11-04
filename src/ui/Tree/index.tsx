
import "./style.css";
import React, { useState } from "react";
import { Folder, Arrow } from "../Icon";
import { TOnSelect } from "../type";

type Evt = React.SyntheticEvent;

type TNode = {
    id: string,
    text: string,
    children?: TNode[],
    open?: boolean,
    redacted?: boolean,
    classified?: boolean,
}

interface IPropsTree {
    notRoot?: boolean,
    onSelect: TOnSelect,
    selected?: string,
    nodes: TNode[],
    open: boolean,
}

function Tree(props: IPropsTree) {
    const nodes = props.nodes.map(node => { // node = TNode
        return (
            <Node
                {...node}
                key={node.id}
                onSelect={props.onSelect}
                selected={props.selected}
                open={props.open}
            />
        );
    });
    const cls = props.notRoot ? ["tree"] : ["tree", "root"];
    return <ul className={cls.join(" ")}>{nodes}</ul>;
}

interface INode {
    id: string,
    open: boolean,
    text: string,
    children?: TNode[],
    onSelect: TOnSelect,
    selected?: string,
    redacted?: boolean,
    classified?: boolean,
}

/* 
The Node component tests dir multiple times. It's written
this way because it's easier to read than batching it
all into one conditional. Practically speaking this is
unlikely to ever be a performance issue - any tree would
have to be very large.

But since components are meant to be somewhat generic
and reusable this comment exists to acknowledge the
choice of readability and the possible need to refactor
it in the future.
*/
function Node(props: INode) {
    
    const [open, setOpen] = useState(props.open);
    const dir = !!props.children;
    const clsLi = [];
    const clsItem = ["item"];
    
    if (open) clsLi.push("open");
    if (dir)  clsLi.push("dir");
    if (props.selected === props.id) clsItem.push("selected");
    if (props.redacted)              clsItem.push("redacted");
    if (props.classified)            clsItem.push("classified");
    
    let handler;
    switch (nodeKind(dir, props.classified)) {
    case Kind.dir:
        handler = (e: Evt) => { setOpen(!open) }; break;
    case Kind.leaf:
        handler = (e: Evt) => { props.onSelect(props.id) }; break;
    }
    
    return (
        <li className={clsLi.join(" ")}>
            <div className={clsItem.join(" ")} onClick={handler}>
                {dir ? <Folder/> : null}
                <div className="text">{props.text}</div>
                <div className="arrow"><Arrow/></div>
            </div> { dir ? // Sneaky tenary operator; Tree is conditional.
            <Tree
                notRoot={true}
                onSelect={props.onSelect}
                selected={props.selected}
                nodes={props.children as TNode[]}
                open={props.open}
            /> : null }
        </li>
    );
}

enum Kind {
    dir = 0,
    leaf,
    leafDead,
}

function nodeKind(dir: boolean, classified?: boolean): Kind {
    if (dir)        return Kind.dir;
    if (classified) return Kind.leafDead;
    return Kind.leaf;
}

export default Tree;
export type {TNode};