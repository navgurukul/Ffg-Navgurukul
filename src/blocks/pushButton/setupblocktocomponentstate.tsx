import type { BlockData } from "../../core/blockly/dto/block.type";
import { findFieldValue } from "../../core/blockly/helpers/block-data.helpers";
import {findSensorState, findSensorStateForControl} from "../../core/blockly/helpers/sensor_block.helper";
import {
  ArduinoComponentType,
  Timeline,
} from "../../core/frames/arduino.frames";
import type { ARDUINO_PINS } from "../../core/microcontroller/selectBoard";
import type {ButtonState, ButtonSensor, ButtonControl} from "./state";

export const buttonSetupBlockToComponentState = (
  block: BlockData,
  timeline: Timeline
): ButtonState => {
  const btState = findSensorState<ButtonSensor>(block, timeline);

  return {
    type: ArduinoComponentType.BUTTON,
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    isPressed: btState.is_pressed,
  };
};

export const buttonControlBlockToComponentState = (
    block: BlockData,
    timeline: Timeline
): ButtonControl => {

  return {
    pins: [findFieldValue(block, "PIN") as ARDUINO_PINS],
    blockName: block.blockName,
    type: ArduinoComponentType.BUTTON,
    is_pressed: false,
  };
};
