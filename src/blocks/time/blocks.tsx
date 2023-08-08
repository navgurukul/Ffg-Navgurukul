import Blockly from "blockly";

Blockly.defineBlocksWithJsonArray([
    {
        type: "time_seconds",
        message0: "%1 seconds arduino been on",
        args0: [
            {
                type: "field_image",
                src: "./blocks/time/time.png",
                width: 15,
                height: 15,
                alt: "*",
                flipRtl: false,
            },
        ],
        output: "Number",
        style: "time_blocks",
        tooltip: "",
        helpUrl: "",
    },
    {
        type: "delay_block",
        message0: "%1 wait for  %2 seconds",
        args0: [
            {
                type: "field_image",
                src: "./blocks/time/time.png",
                width: 15,
                height: 15,
                alt: "*",
                flipRtl: false,
            },
            {
                type: "input_value",
                name: "DELAY",
                check: "Number",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        style: "time_blocks",
        tooltip: "",
        helpUrl: "",
    },
]);

const timeSetupBlock: any = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldImage("./blocks/time/time.png", 15, 15))
            .appendField("Setup Time");

        this.appendDummyInput()
            .appendField("How many seconds per loop")
            .appendField(
                new Blockly.FieldNumber(0.1, 0, 100000, 0.00001),
                "time_in_seconds"
            );

        this.setStyle("time_blocks");
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["time_setup"] = timeSetupBlock;
