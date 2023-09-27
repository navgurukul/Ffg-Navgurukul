import React, { useEffect, useState } from "react";
import SimulatorComponent from "../../simulator/simulatorComponent";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import "./slider.css";
import Prism from "prismjs"; // Prism
import "prismjs/themes/prism-coy.min.css";
import codeStore from "../../stores/code.store";
require("prismjs/components/prism-c");
require("prismjs/plugins/line-numbers/prism-line-numbers")

function Slider(props) {
    const [isSimulator, setSimulator] = useState(false);

    function switch_menu() {
        setSimulator(!isSimulator);
        props.simulatorfunc(!isSimulator);
    }

    useEffect(() => {
        Prism.highlightAll();
        var overlay = document.getElementById("overlay")
        document.onclick = function (e: MouseEvent) {
            if ((e.target as HTMLDivElement).id == 'overlay') {
                overlay.style.display = 'none';
                setSimulator(false);
                props.simulatorfunc(false);
                props.func(false);
                props.playfunc(false);
            }
        }
        setSimulator(props.simulator)
    });

    let code = "";
    codeStore.subscribe(async (value) => {
        code = value.code;
    })

    return (
        <div className="slider">
            {props.code ? null :
                <div className={isSimulator ? "slider_icon_left" : "slider_icon_right"} onClick={switch_menu}>
                    <div className="icon_box" />
                    <div className="arrow">
                        {props.code || isSimulator ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                    </div>
                </div>}
            {props.code || isSimulator ? <div id="overlay" /> : null}
            {props.code ?
                <div className="code_container">
                    <pre className="line-numbers language-c">
                        <code className="language-c code">
                            {code}
                        </code>
                    </pre >
                </div > :
                isSimulator ?
                    <div className="slider_container">
                        <div className="container_box" />
                        <SimulatorComponent play={props.play}/>
                    </div> :
                    null
            }
        </div>
    );
};

export default Slider;