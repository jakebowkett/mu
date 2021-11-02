
import "./style.css";
import Button from "../Button";
import { OnSelect } from "../Tree";

interface IPropsViewer {
    id: string,
    onRemove: OnSelect,
    file?: string,
}

function Viewer(props: IPropsViewer) {
    let f = props.file;
    const cls = ["viewer"];
    if (!f) {
        cls.push("empty");
        f = "Appoint record to behold."
    }
    return (
        <div id={props.id} className={cls.join(" ")}>
            <Button
                text="Banish X"
                onClick={() => { props.onRemove(null) }}
                {...(props.file ? {} : {hidden: true})}
            />
            <div
                className="content"
                dangerouslySetInnerHTML={{ __html: f ? f : "" }}
            />
            <div className="orbs">
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    );
}

export default Viewer;