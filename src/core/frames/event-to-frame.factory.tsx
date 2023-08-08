import {BlockEvent} from "../blockly/dto/event.type";
import {
    ArduinoComponentState,
    ArduinoFrame,
    ArduinoFrameContainer,
    SENSOR_COMPONENTS,
    Timeline
} from "./arduino.frames";
import {BlockData, BlockType} from "../blockly/dto/block.type";
import * as _ from "lodash";
import {generateFrame, generateInputFrame} from "./transformer/block-to-frame.transformer";
import {
    findArduinoLoopBlock,
    findArduinoSetupBlock,
    getLoopTimeFromBlockData
} from "../blockly/helpers/block-data.helpers";
import {convertToState, sensorSetupBlockName} from "../blockly/transformers/sensor-data.transformer";
import {defaultSetting, Settings} from "../../arduinoSettings/boardSetting";

export const eventToFrameFactory = (
    event: BlockEvent,
    settings: Settings = defaultSetting
): ArduinoFrameContainer => {
    const { blocks } = event;

    const preSetupBlockType = [
        BlockType.SENSOR_SETUP,
        BlockType.SENSOR_CONTROL,
        BlockType.SETUP,
        BlockType.LIST_CREATE,
    ];

    const preSetupBlocks = blocks.filter((b) =>
        preSetupBlockType.includes(b.type)
    );

    const frames: ArduinoFrame[] = preSetupBlocks.reduce((prevFrames, block) => {
        const previousState =
            prevFrames.length === 0
                ? undefined
                : _.cloneDeep(prevFrames[prevFrames.length - 1]);

        return [
            ...prevFrames,
            ...generateFrame(
                blocks,
                block,
                event.variables,
                { iteration: 0, function: "pre-setup" },
                previousState
            ),
        ];
    }, []);

    const arduinoSetupBlock = findArduinoSetupBlock(blocks);

    const previousFrame = _.isEmpty(frames)
        ? undefined
        : frames[frames.length - 1];

    const setupFrames = arduinoSetupBlock
        ? generateInputFrame(
            arduinoSetupBlock,
            blocks,
            event.variables,
            { iteration: 0, function: "setup" },
            "setup",
            1,
            getPreviousState(
                blocks,
                { iteration: 0, function: "pre-setup" },
                previousFrame
            )
        )
        : [];

    setupFrames.forEach((f) => frames.push(f));

    const arduinoLoopBlock = findArduinoLoopBlock(blocks);
    const loopTimes = getLoopTimeFromBlockData(blocks);
    let stopAllFrames = false;
    const framesWithLoop = _.range(1, loopTimes + 1).reduce(
        (prevFrames, loopTime) => {
            if (stopAllFrames) {
                return prevFrames;
            }
            const timeLine: Timeline = { iteration: loopTime, function: "loop" };
            const previousFrame = _.isEmpty(prevFrames)
                ? undefined
                : prevFrames[prevFrames.length - 1];

            const frames = generateInputFrame(
                arduinoLoopBlock,
                blocks,
                event.variables,
                timeLine,
                "loop",
                1,
                getPreviousState(blocks, timeLine, _.cloneDeep(previousFrame)) // Deep clone to prevent object memory sharing
            );

            if (frames.length > 0 && frames[frames.length - 1].frameNumber > 5000) {
                stopAllFrames = true;
                alert(`Reached maximun steps for simulation.`);
                const count = prevFrames.length;
                const leftTo5000 = 5000 - count;
                // minus 1 because we are starting from 0 index
                return [...prevFrames, ...frames.slice(0, leftTo5000)];
            }

            return [...prevFrames, ...frames];
        },
        frames
    );

    return {
        board: event.microController,
        frames: framesWithLoop,
        error: false,
        settings
    };
};

const getPreviousState = (
    blocks: BlockData[],
    timeline: Timeline,
    previousFrame: ArduinoFrame = undefined
): ArduinoFrame => {
    if (previousFrame === undefined) {
        return undefined;
    }

    const nonSensorComponent = (previousFrame as ArduinoFrame).components.filter(
        (c) => !isSensorComponent(c)
    );
    const sensorSetupBlocks = blocks.filter((b) =>
        sensorSetupBlockName.includes(b.blockName)
    );
    const newComponents = [
        ...nonSensorComponent,
        ...sensorSetupBlocks.map((b) => convertToState(b, timeline)),
    ];
    return { ...previousFrame, components: newComponents };
};

const isSensorComponent = (component: ArduinoComponentState) => {
    {
        return SENSOR_COMPONENTS.includes(component.type);
    }
};
