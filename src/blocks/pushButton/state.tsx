import type { Sensor } from "../../core/blockly/dto/sensor.type";
import type { ArduinoComponentState } from "../../core/frames/arduino.frames";
import {ARDUINO_PINS} from "../../core/microcontroller/selectBoard";
import {ControlSensor} from "../../core/blockly/dto/sensor.type";

export interface ButtonSensor extends Sensor {
  is_pressed: boolean;
}

export interface ButtonControl extends ArduinoComponentState {
  blockName: string;
  is_pressed: boolean;
}

export interface ButtonState extends ArduinoComponentState {
  isPressed: boolean;
}
