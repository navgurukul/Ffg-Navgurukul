import type { Timeline } from "../../frames/arduino.frames";
import type { BlockData } from "../dto/block.type";
import type {ControlSensor, Sensor} from "../dto/sensor.type";

export const findSensorState = <S extends Sensor>(
    block: BlockData,
    timeline: Timeline
): S => {
    const sensorStates = JSON.parse(block.metaData) as S[];

    return sensorStates.find((s) => {
        return (
            (timeline.function === "pre-setup" || timeline.function === "setup")
        );
    }) as S;
};

export const findSensorStateForControl = <S extends ControlSensor>(
    block: BlockData,
    timeline: Timeline
): S => {
    const sensorStates = JSON.parse(block.metaData) as S[];

    return sensorStates.find((s) => {
        return (
            ((timeline.function === "pre-setup" || timeline.function === "setup"))
        );
    }) as S;
};
