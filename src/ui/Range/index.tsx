
import "./style.css";

interface IPropsRange {
    id?: string,
    reverse?: boolean,
    offPc: number,
    offEnd: boolean,
};

function Range(props: IPropsRange) {
    const cls = ["range"];
    if (props.reverse) {
        cls.push("reverse");
    }
    if (props.offEnd) {
        cls.push("at-end");
    }
    return (
        <div
            {...(props.id ? {id: props.id} : {})}
            className={cls.join(" ")}
        >
            <div className="pos">
                <div
                    style={{top: `${props.offPc}%`}}
                    className="dragger"
                />
                <div className="end"/>
            </div>
            <div className="track"/>
        </div>
    );
}

export default Range;