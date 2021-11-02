import React, { ReactSVGElement } from "react";

function Icon(props: {elements: ReactSVGElement[][]}) {
    return (
        <div className="icon">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
            >
                {props.elements}
            </svg>
        </div>
    );
}

function paths(...dd: string[]) {
    let i = 0;
    return dd.map(d => {
        i++;
        return React.createElement("path", {key: i.toString(), d: d});
    });
}

function ArrowWide(props: {}) {
    return (
        <Icon elements={[
            paths(`
                M  35  50
                L  35  25
                L  45  25
                L  45  10
                L  70  50
                L  45  90
                L  45  75
                L  35  75
                L  35  50
            `),
        ]}/>
    );
}

function Folder(props: {}) {
    return (
        <Icon elements={[
            paths(`
                M 100  20
                L 100  90
                L   0  90
                L   0  40
                L  10  30
                L  50  30
                L  60  20
                L 100  20
                Z
            `),
        ]}/>
    );
}

function Arrow(props: {}) {
    return (
        <Icon elements={[
            paths(`
                M  25  20
                L  35  10
                L  75  50
                L  35  90
                L  25  80
                L  55  50
                L  25  20
                Z
            `),
        ]}/>
    );
}

function File(props: {}) {
    return (
        <Icon elements={[
            paths(
                `
                    M   5  15
                    L  95  15
                    L  95  25
                    L   5  25
                    L   5  15
                    Z
                `,
                `
                    M   5  35
                    L  75  35
                    L  75  45
                    L   5  45
                    L   5  35
                    Z
                `,
                `
                    M   5  55
                    L  95  55
                    L  95  65
                    L   5  65
                    L   5  55
                    Z
                `,
                `
                    M   5  75
                    L  55  75
                    L  55  85
                    L   5  85
                    L   5  75
                    Z
                `,
            ),
        ]}/>
    );
}

export {Folder, Arrow, ArrowWide, File};