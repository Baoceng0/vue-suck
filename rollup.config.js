import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
// 打包出入口
export default {
    input:'./src/index.js',
    output:{
        file:'./dist/vue.js',
        name:'Vue',
        format:'umd',
        sourcemap: true,
    },
    plugins:[
        babel({
            exclude: 'node_modules/**'
        }),
        resolve()
    ]
}