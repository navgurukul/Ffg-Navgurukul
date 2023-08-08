import type {BlockData} from "../../core/blockly/dto/block.type";
import {findFieldValue} from "../../core/blockly/helpers/block-data.helpers";
import type {ButtonSensor} from "./state";
import {ButtonControl} from "./state";
import {ArduinoComponentType} from "../../core/frames/arduino.frames";

export const buttonSetupBlockToSensorData = (
  block: BlockData
): ButtonSensor => {
  return {
    is_pressed: findFieldValue(block, "is_pressed") === "TRUE",
    loop: +findFieldValue(block, "LOOP"),
    blockName: block.blockName,
  };
};

export const buttonControlBlockToSensorData = (
    block: BlockData
): ButtonControl => {
  return {
    blockName: block.blockName,
    pins: block.pins,
    type: ArduinoComponentType.BUTTON,
    is_pressed: false
  };
};
