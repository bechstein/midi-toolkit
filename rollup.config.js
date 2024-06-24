import typescript from "@rollup/plugin-typescript";
import {terser} from "rollup-plugin-terser";

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/esm/index.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [typescript(), terser()]
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/cjs/index.js',
            format: 'cjs',
            sourcemap: true
        },
        plugins: [typescript(), terser()]
    },
];
