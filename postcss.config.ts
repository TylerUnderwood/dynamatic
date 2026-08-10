import cssnano from 'cssnano'
import postcssPresetEnv from 'postcss-preset-env'

import fluidLength from './postcss/fluidLength.ts'

export default {
    plugins: [
        cssnano({
            preset: 'default',
        }),
		postcssPresetEnv({
			stage: 2,
		}),
		fluidLength({
			output: 'clamp',
		}),
    ],
};
