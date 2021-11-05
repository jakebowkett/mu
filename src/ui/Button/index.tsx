
import "./style.css";

interface IPropsButton {
    onClick: () => void,
    text: string,
    classes?: string[],
    dangerous?: boolean,
    hidden?: boolean,
}

function Button(props: IPropsButton) {
    const cls = ["btn"];
    if (props.dangerous) cls.push("dangerous");
    if (props.hidden)    cls.push("hidden");
    if (props.classes)   cls.push(...props.classes);
    return (
        <button
            className={cls.join(" ")}
            onClick={props.onClick}
            type="button"
        >
            <span className="arrow"/>
            <span className="text">{props.text}</span>
        </button>
    );
}

export default Button;