import type { BlockToFrameTransformer } from "../../core/frames/transformer/block-to-frame.transformer";
import _ from "lodash";
import { ArduinoComponentType } from "../../core/frames/arduino.frames";
import { arduinoFrameByComponent } from "../../core/frames/transformer/frame-transformer.helpers";
import type { ButtonSensor, ButtonState } from "./state";
import {ButtonControl} from "./state";

export const buttonSetup: BlockToFrameTransformer = (
  blocks,
  block,
  variables,
  timeline,
  previousState
) => {
  const btnDatum = JSON.parse(block.metaData) as ButtonSensor[];
  const btnData = btnDatum.find((d) => d.loop === 1);

  const [pin] = block.pins;

  const buttonState: ButtonState = {
    type: ArduinoComponentType.BUTTON,
    pins: block.pins,
    isPressed: btnData.is_pressed,
  };

  return [
    arduinoFrameByComponent(
      block.id,
      block.blockName,
      timeline,
      buttonState,
      `button ${pin} is being setup.`,
      previousState
    ),
  ];
};

export const buttonControl: BlockToFrameTransformer = (
    blocks,
    block,
    variables,
    timeline,
    previousState
) => {

  const [pin] = block.pins;

  const buttonState: ButtonControl = {
    type: ArduinoComponentType.BUTTON,
    pins: block.pins,
    blockName: block.blockName,
    is_pressed: false,
  };

  return [
    arduinoFrameByComponent(
        block.id,
        block.blockName,
        timeline,
        buttonState,
        `button ${pin} is being setup.`,
        previousState,
    ),
  ];
};
