import React, { useState } from "react";
import SimulatorComponent from "../../simulator/simulatorComponent";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import "./navBar.css"

function NavBar() {
    const [showSlider, setSlider] = useState(false);

    function switch_menu() {
        setSlider(!showSlider);
    }

    return (
        <div className="slider">
            <div className="slider_icon" onClick={switch_menu} >
                <div className="icon_box" />
                <div className="arrow">
                    {showSlider ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                </div>
            </div>
            {
                showSlider ?
                    <div className="slider_container">
                        <div className="container_box" />
                        <SimulatorComponent />
                    </div> : null
            }
        </div>
    )
}

export default NavBar;