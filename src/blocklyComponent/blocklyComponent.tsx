import {useEffect, useRef, useState} from "react";
import Blockly, {BlockSvg, WorkspaceSvg} from 'blockly';
import React from 'react';

import * as En from 'blockly/msg/en';
import {connect} from "react-redux";
import '../blocklyComponent/blocklyComponent.css'
import startBlockly from "../core/blockly/startBlockly";
import currentFrameStore from "../stores/currentFrame.store";
import {createBlock, getAllBlocks, getBlockById} from "../core/blockly/helpers/block.helper";
import updateLoopblockStore from "../stores/update-loopblock.store";
import {
    arduinoLoopBlockShowLoopForeverText,
    arduinoLoopBlockShowNumberOfTimesThroughLoop
} from "../core/blockly/helpers/arduino_loop_block.helper";
import {addListener, createFrames} from "../core/blockly/registerEvents";
import update from "../core/virtual-circuit/update";
import {draw} from "svelte/transition";
import Header from "../components/header/header";
import Slider from "../components/slider/slider";
Blockly.setLocale(En);
function resizeBlockly() {
    Blockly.svgResize(Blockly.getMainWorkspace() as WorkspaceSvg);
}
const BlocklyComponents = () => {
    let showLoopExecutionTimesArduinoStartBlock = true;
    const blocklyElement = useRef<HTMLDivElement>(null)
    const unsubscribes = [];
    let workspaceInitialize = false;
    const [loadEl,setLoadEl] = useState(0);
    const [code, setCode] = useState(false)
    const [simulator, setSimulator] = useState(false)
    const [play, setPlay] = useState(false)

    useEffect(()=>{
        window.Blockly = Blockly;
        startBlockly(blocklyElement)
        unsubscribes.push(
            currentFrameStore.subscribe((frame) => {
                if (!frame) return;
                getAllBlocks().forEach((b) => b.unselect());
                const selectedBlock = getBlockById(frame.blockId);
                if (selectedBlock) {
                    selectedBlock.select();
                }
            })
        );
        unsubscribes.push(
            updateLoopblockStore.subscribe(() => {
                if (showLoopExecutionTimesArduinoStartBlock && workspaceInitialize) {
                    arduinoLoopBlockShowNumberOfTimesThroughLoop();
                } else if (workspaceInitialize) {
                    arduinoLoopBlockShowLoopForeverText();
                }
            })
        );
    },[loadEl])

    const isCode = (data) => {
        setCode(data);
      }

    const playSimulator = (data) => {
        setSimulator(data)
    }

    const playfunc = (data) => {
        setPlay(data)
    }

    return (
        <React.Fragment>
            <Header func={isCode} simulatorfunc={playSimulator} code={code} playfunc={playfunc} />           
            <div ref={blocklyElement} id="blocklyDiv" />  
            <Slider func={isCode} code={code} simulator={simulator} simulatorfunc={playSimulator} play={play} playfunc={playfunc}/>
        </React.Fragment>)
}

const mapStateToProps = (state: { posts: any; }) => {
    return {
        posts: state.posts
    }
}

export default connect(mapStateToProps)(BlocklyComponents);
