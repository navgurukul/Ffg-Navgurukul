import {VariableModel} from "blockly";
import {VariableData, VariableTypes} from "../blockly/dto/variable.type";
import {isVariableBeingUsed} from "../blockly/helpers/variable.helper";

export const transformVariable = (variable: VariableModel): VariableData => {
    return {
        isBeingUsed: isVariableBeingUsed(variable.getId()),
        name: variable.name,
        id: variable.getId(),
        type: variable.type as VariableTypes,
    };
};