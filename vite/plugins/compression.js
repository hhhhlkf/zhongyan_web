/*
 * @Author: pmy
 * @Date: 2023-10-31 14:19:31
 * @LastEditors: pmy
 * @LastEditTime: 2023-11-07 10:29:47
 * @FilePath: \bdcar-net\vite\plugins\compression.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import compression from 'vite-plugin-compression'

export default function createCompression(env) {
    const { VITE_BUILD_COMPRESS } = env
    const plugin = []
    if (VITE_BUILD_COMPRESS) {
        const compressList = VITE_BUILD_COMPRESS.split(',')
        if (compressList.includes('gzip')) {
            // http://doc.exsun/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
            plugin.push(
                compression({
                    ext: '.gz',
                    deleteOriginFile: false,
                    filter: (source) => {
                        // 排除特定文件
                        return !source.endsWith('GlobalSetting.js');
                    },
                })
            )
        }
        if (compressList.includes('brotli')) {
            plugin.push(
                compression({
                    ext: '.br',
                    algorithm: 'brotliCompress',
                    deleteOriginFile: false,
                })
            )
        }
    }
    return plugin
}
