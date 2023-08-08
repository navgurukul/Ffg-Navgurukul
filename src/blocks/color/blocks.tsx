import Blockly from "blockly";
import {ColorWheelField} from 'blockly-field-color-wheel';

Blockly.Blocks["color_picker_custom"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new ColorWheelField("#ffffff"),
            "COLOR"
        );
        this.setOutput(true, "Colour");
        this.setStyle("colour_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    },
};
