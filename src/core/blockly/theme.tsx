import { COLOR_THEME } from './constants/colors';
import type { BlocklyThemeOptions } from 'blockly';

export const theme: BlocklyThemeOptions = {
    blockStyles: {
        logic_blocks: {
            colourPrimary: COLOR_THEME.BLUE,
            colourSecondary: COLOR_THEME.BLUE,
            colourTertiary: COLOR_THEME.BLUE,
            hat: '',
        },
        loop_blocks: {
            colourPrimary: COLOR_THEME.PURPLE,
            colourSecondary: COLOR_THEME.PURPLE,
            colourTertiary: COLOR_THEME.PURPLE,
            hat: '',
        },
        time_blocks: {
            colourPrimary: COLOR_THEME.GREEN,
            colourSecondary: COLOR_THEME.GREEN,
            colourTertiary: COLOR_THEME.GREEN,
            hat: '',
        },
        math_blocks: {
            colourPrimary: COLOR_THEME.YELLOW,
            colourSecondary: COLOR_THEME.YELLOW,
            colourTertiary: COLOR_THEME.YELLOW,
            hat: '',
        },
        text_blocks: {
            colourPrimary: COLOR_THEME.ORANGE,
            colourSecondary: COLOR_THEME.ORANGE,
            colourTertiary: COLOR_THEME.ORANGE,
            hat: '',
        },
        colour_blocks: {
            colourPrimary: COLOR_THEME.PINK,
            colourSecondary: COLOR_THEME.PINK,
            colourTertiary: COLOR_THEME.PINK,
            hat: '',
        },
        variable_blocks: {
            colourPrimary: COLOR_THEME.DATA,
            colourSecondary: COLOR_THEME.DATA,
            colourTertiary: COLOR_THEME.DATA,
            hat: '',
        },
        list_blocks: {
            colourPrimary: COLOR_THEME.DATA,
            colourSecondary: COLOR_THEME.DATA,
            colourTertiary: COLOR_THEME.DATA,
            hat: '',
        },
    },
};
