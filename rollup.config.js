import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import minify from 'rollup-plugin-babel-minify';
import nodeResolve  from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import replace from '@rollup/plugin-replace';

const config = {
  input: 'src/package.tsx',
  output: {
    file: 'dist/bundle.min.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    babel({
      presets: ["@babel/preset-react"],
    }),
    peerDepsExternal(),
    nodeResolve({
      extensions: [".js"],
    }),
    commonjs(),
    minify(),
    // replace({
    //   'process.env.NODE_ENV': JSON.stringify( 'development' )
    // })
  ]
};
export default config