
import "./style.css";

function Map() {
    return (
        <div className="map">
            <div className="display">
                <div className="labels">
                    <Label text="Sector 07" align={Align.bottomLeft}/>
                    <Label text="Lixenih"/>
                    <Label text="KP Recess" align={Align.topRight}/>
                </div>
                <div className="lines">
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
            <div className="bevel"/>
            <div className="recess">
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    );
}

enum Align {
    topLeft = 0,
    topRight,
    bottomLeft,
    bottomRight,
}

interface IPropsLabel {
    text:  string,
    align?: Align,
}

function Label(props: IPropsLabel) {
    const cls = [];
    const a = props.align ? props.align : Align.topLeft;
    switch (a) {
    case Align.topLeft:     cls.push("top", "left");     break;
    case Align.topRight:    cls.push("top", "right");    break;
    case Align.bottomLeft:  cls.push("bottom", "left");  break;
    case Align.bottomRight: cls.push("bottom", "right"); break;
    }
    return (
        <div className={["label", ...cls].join(" ")}>
            <div className="text">{props.text}</div>
            <div className="lip"/>
        </div>
    );
}

export default Map;