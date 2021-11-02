
import "./style.css";
import React from "react";

interface IStateBar {
    offset: number,
    intervalId?: number,
};

class Bar extends React.Component<{}, IStateBar> {
    
    constructor(props: {}) {
        super(props);
        this.state = {offset: 0};
    }

    componentDidMount() {
        this.setState({intervalId: window.setInterval(() => this.tick(), 200)});
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
    }

    tick() {
        const n = Math.random() * 100;
        this.setState({offset: (n + this.state.offset/2) / 1.5});
    }

    render() {
        const props = {style: {width: `${this.state.offset}%`}};
        return (
            <div className="bar">
                <div {...props}></div>
            </div>
        );
    }
}

export default Bar;