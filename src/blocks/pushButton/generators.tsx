import Blockly, { BlockSvg } from 'blockly';

Blockly['Arduino']['button_control'] = function (block: BlockSvg) {
    const pin = block.getFieldValue('PIN');

    Blockly['Arduino'].setupCode_['btn_pin_' + pin] =
        '\tpinMode(' + pin + ', INPUT_PULLUP); \n';

    return '';
};

Blockly['Arduino']['is_button_pressed'] = function(block: BlockSvg) {
  const pin = block.getFieldValue('PIN');

  return ["(digitalRead(" + pin + ") == LOW)", Blockly["Arduino"].ORDER_ATOMIC];
};
