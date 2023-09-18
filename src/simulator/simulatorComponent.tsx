import React, {useEffect, useRef, useState} from "react";
import './simulatorComponent.css'
import * as En from 'blockly/msg/en';
import Blockly from "blockly";
import {onErrorMessage} from "../help/alert";
import { SVG } from '@svgdotjs/svg.js';
import frameStore from "../stores/frame.store";
import paint from "../core/virtual-circuit/paint";
import {centerCircuit} from "../core/virtual-circuit/centerCircuit";
import {arduinoComponentStateToId} from "../core/frames/arduino-component-id";
import update from "../core/virtual-circuit/update";
import '@svgdotjs/svg.panzoom.js'
import currentFrameStore from "../stores/currentFrame.store";
import {wait} from "@testing-library/user-event/dist/utils";
import { useHistory } from "react-router-dom";
import { play, stop }from "../player/playerComponent";
import startBlockly from "../core/blockly/startBlockly";
import {BsFillPlayCircleFill, BsPlusCircle, BsDashCircle, BsFillStopCircleFill} from "react-icons/bs";
import { BiTargetLock } from "react-icons/bi";
import _ from "lodash";

Blockly.setLocale(En);
function SimulatorComponent(){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let container = useRef<HTMLDivElement>(null)
    let draw;
    let unsubscribes = [];
    let currentFrame = undefined;
    let frames = [];
    let isPushButtonPressed = useRef(false)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(()=>{

        draw = SVG()
            .addTo(document.getElementById("container"))
            .size(container.current.clientWidth - 10, container.current.clientHeight - 10)
            .viewbox(0, 0, container.current.clientWidth - 10, container.current.clientWidth - 10)
            .panZoom();

        unsubscribes.push(
            frameStore.subscribe((frameContainer) => {
                let oldLastFrame =
                    frames.length > 0 ? frames[frames.length - 1] : undefined;
                frames = frameContainer.frames;
                const firstFrame = frames ? frames[0] : undefined;
                const lastFrame = frames ? frames[frames.length - 1] : undefined;
                currentFrame = firstFrame;
                paint(draw, frameContainer);
                update(draw, firstFrame);

                const oldListOfComponentIds = oldLastFrame
                    ? oldLastFrame.components
                        .map((f) => {
                            try {
                                return arduinoComponentStateToId(f);
                            } catch {
                                return '';
                            }
                        })
                        .join('')
                    : '';

                const newListOfComponentIds = lastFrame
                    ? lastFrame.components
                        .map((f) => {
                            try {
                                return arduinoComponentStateToId(f);
                            } catch {
                                return '';
                            }
                        })
                        .join('')
                    : '';

                if (newListOfComponentIds !== oldListOfComponentIds) {
                    centerCircuit(draw, lastFrame);
                }
            })
        );


        unsubscribes.push(
            currentFrameStore.subscribe((frame) => {
                window.addEventListener('mousedown',(e)=>{
                    if((e.target as HTMLElement).id === 'COLOR_BTN_NOT_PRESSED' || (e.target as HTMLElement).id === 'BUTTON_NOT_PRESSED'){
                        draw.findOne("#BUTTON_PRESSED_TEXT").show();
                        draw.findOne("#BUTTON_TEXT").hide();
                        draw.findOne("#BUTTON_PRESSED").show();
                        draw.findOne("#BUTTON_NOT_PRESSED").hide();
                        isPushButtonPressed.current = true
                    }
                    if((e.target as HTMLElement).id === 'COLOR_BTN_PRESSED' || (e.target as HTMLElement).id === 'BUTTON_PRESSED'){
                        draw.findOne("#BUTTON_PRESSED_TEXT").hide();
                        draw.findOne("#BUTTON_TEXT").show();
                        draw.findOne("#BUTTON_PRESSED").hide();
                        draw.findOne("#BUTTON_NOT_PRESSED").show();
                        isPushButtonPressed.current = false
                    }
                })
                currentFrame = _.cloneDeep(frame);
                if(currentFrame.shouldDisplay ===1){
                    update(draw, currentFrame);
                }else{
                    if(isPushButtonPressed.current){
                        if(currentFrame.shouldDisplay===0) return
                        else update(draw, currentFrame);
                    }else{
                        if(currentFrame.shouldDisplay===-1) return
                        else update(draw, currentFrame);
                    }
                }

                // else if(currentFrame.shouldDisplay===0){
                //     if(isPushButtonPressed.current){
                //         return
                //     }else{
                //         update(draw, currentFrame);
                //     }
                // }else if(currentFrame.shouldDisplay===-1){
                //     if(!isPushButtonPressed.current){
                //        return
                //     }
                //     else{
                //         update(draw, currentFrame);
                //     }
                // }
                document.getElementById("container").innerHTML = draw.svg()



            })
        );

    },[])

    function zoomIn() {
        draw = draw.zoom(draw.zoom() + 0.05);
        if (container && container.current) container.current.innerHTML = draw.svg()
    }

    function zoomOut() {
        draw.zoom(draw.zoom() - 0.05);
        if (container && container.current) container.current.innerHTML = draw.svg()
    }

    function reCenter() {
        if (draw) {
            centerCircuit(
                draw,
                frames.length > 0 ? frames[frames.length - 1] : undefined
            );
        }
        if (container && container.current) container.current.innerHTML = draw.svg()
    }

    const [showButton, setButton] = useState(false);
    const [disabled, setDisabled] = useState(false);
    function switch_button() {
        setButton(!showButton);
        setDisabled(true);
        if (showButton) {
            stop();
        }
        else {
            play();
        }
    }

    return(
        <React.Fragment>
            <div ref={container} id="container" className="simulator" />
            <div className="simulatorIcons">
                {showButton ? <BsFillStopCircleFill onClick={switch_button} className="simulatorIcon" color="red" />
                    : <BsFillPlayCircleFill onClick={switch_button} className="simulatorIcon" color="green" />}
                <BsPlusCircle onClick={disabled ? () => { } : zoomIn} className="simulatorIcon" color={disabled ? "grey" : "black"} />
                <BsDashCircle onClick={disabled ? () => { } : zoomOut} className="simulatorIcon" color={disabled ? "grey" : "black"} />
                <BiTargetLock onClick={disabled ? () => { } : reCenter} className="simulatorIcon" color={disabled ? "grey" : "black"} />
            </div>
        </React.Fragment>
    )

}

export default SimulatorComponent;
