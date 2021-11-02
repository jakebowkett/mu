
import "./style.css";

enum align {
    topLeft = 1,
    topRight,
    bottomLeft,
    bottomRight,
}

interface IPropsLabel {
    text:  string,
    align?: align,
}

function Label(props: IPropsLabel) {
    const cls = [];
    const a = props.align ? props.align : align.topLeft;
    switch (a) {
    case align.topLeft:     cls.push("top", "left");     break;
    case align.topRight:    cls.push("top", "right");    break;
    case align.bottomLeft:  cls.push("bottom", "left");  break;
    case align.bottomRight: cls.push("bottom", "right"); break;
    }
    return (
        <div className={["label", ...cls].join(" ")}>
            <div className="text">{props.text}</div>
            <div className="lip"/>
        </div>
    );
}

function Map(props: {}) {
    return (
        <div className="map">
            <div className="display">
                <div className="labels">
                    <Label text="Sector 07" align={align.bottomLeft}/>
                    <Label text="Lixenih"/>
                    <Label text="KP Recess" align={align.topRight}/>
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

export default Map;