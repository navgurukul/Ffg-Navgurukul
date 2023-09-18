import React, { useState } from "react";
import SimulatorComponent from "../../simulator/simulatorComponent";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import "./slider.css"
import { stop } from "../../player/playerComponent";
import onClickOutside from "react-onclickoutside";

function Slider() {
    const [showSlider, setSlider] = useState(false);

    function switch_menu() {
        setSlider(!showSlider);
        if (!showSlider) {
            stop();
        }
    }

    Slider.clickOutside = () => setSlider(false);

    return (
        <div className="slider">
            <div className={showSlider ? "slider_icon_left" : "slider_icon_right"} onClick={switch_menu}>
                <div className="icon_box" />
                <div className="arrow">
                    {showSlider ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
                </div>
            </div>
            {showSlider ? <div className="w3-overlay" style={{ cursor: "pointer" }} title="close slider" id="myOverlay blocklyDiv" /> : null}
            {
                showSlider ?
                    <div className="slider_container">
                        <div className="container_box" />
                        <SimulatorComponent />
                    </div> : null
            }
        </div>
    );
};

Slider.clickOutside = null

export default onClickOutside(Slider, {
    handleClickOutside: () => Slider.clickOutside,
})