import { BlockData } from "../../blockly/dto/block.type";
import {VariableData} from "../../blockly/dto/variable.type";
import {ArduinoFrame, Timeline} from "../arduino.frames";
import {timeSetup} from "../../../blocks/time/blocktoframe.time";
import * as _ from "lodash";
import {findBlockById, findInputStatementStartBlock} from "../../blockly/helpers/block-data.helpers";
import {ifElse} from "../../../blocks/logic/blocktoframe";
import {delayBlock} from "../../../blocks/time/blocktoframe.delay";
import {forLoop, simpleLoop} from "../../../blocks/loops/blocktoframe";
import {led} from "../../../blocks/led/blocktoframe";
import {buttonControl, buttonSetup} from "../../../blocks/pushButton/blocktoframe";

export interface BlockToFrameTransformer {
    (
        blocks: BlockData[],
        block: BlockData,
        variables: VariableData[],
        timeline: Timeline,
        previousState?: ArduinoFrame,
        ternaryValue?: boolean,
    ): ArduinoFrame[];
}

export const generateFrame: BlockToFrameTransformer = (
    blocks,
    block,
    variables,
    timeline,
    previousState,
    ternaryValue,
) => {
    try {
        return blockToFrameTransformerList[block.blockName](
            blocks,
            block,
            variables,
            timeline,
            previousState,
            ternaryValue
        );
    } catch (e) {
        console.log(block.blockName, "block name");
        throw e;
    }
};

const blockToFrameTransformerList: {
    [blockName: string]: BlockToFrameTransformer;
} = {
    time_setup: timeSetup,
    control_if: ifElse,
    controls_ifelse: ifElse,
    controls_repeat_ext: simpleLoop,
    controls_for: forLoop,
    delay_block: delayBlock,
    led: led,
    button_setup: buttonSetup,
    button_control: buttonControl,
};

export const generateInputFrame = (
    block: BlockData,
    blocks: BlockData[],
    variables: VariableData[],
    timeline: Timeline,
    inputName: string,
    shouldDisplay: number,
    previousState?: ArduinoFrame
): ArduinoFrame[] => {
    // Fixing memory sharing between objects
    previousState = previousState ? _.cloneDeep(previousState) : undefined;
    const startingBlock = findInputStatementStartBlock(blocks, block, inputName);
    if (!startingBlock) {
        return [];
    }
    const arduinoStates = [];
    let nextBlock = startingBlock;
    do {
        if(nextBlock.blockName==='controls_ifelse'){
            const ifStates = generateFrame(
                blocks,
                nextBlock,
                variables,
                timeline,
                previousState,
                true,
            );
            arduinoStates.push(...ifStates);
            // const newPreviousState1 = ifStates[ifStates.length - 1];
            // previousState = _.cloneDeep(newPreviousState1);
            const elseStates = generateFrame(
                blocks,
                nextBlock,
                variables,
                timeline,
                previousState,
                false,
            );
            arduinoStates.push(...elseStates);
            const newPreviousState2 = elseStates[elseStates.length - 1];
            previousState = _.cloneDeep(newPreviousState2);
        }
        else{
            const states = generateFrame(
                blocks,
                nextBlock,
                variables,
                timeline,
                previousState,
                true,
            );
            states.forEach(state => {
                if(inputName==='DO0' || inputName==='ELSE'){
                    state.shouldDisplay = shouldDisplay
                }
            })
            console.log('states =', states)
            arduinoStates.push(...states);
            const newPreviousState = states[states.length - 1];
            previousState = _.cloneDeep(newPreviousState);
        }

        nextBlock = findBlockById(blocks, nextBlock.nextBlockId);
    } while (nextBlock !== undefined);

    return arduinoStates;
};
