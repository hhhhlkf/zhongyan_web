/*
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-29 14:39:38
 * @FilePath: \web\vite\plugins\index.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import { mars3dPlugin } from 'vite-plugin-mars3d';

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'


export default function createVitePlugins(viteEnv, isBuild = false) {
    const vitePlugins = [vue(), vueJsx(), mars3dPlugin()]
    vitePlugins.push(createAutoImport())
    vitePlugins.push(createSetupExtend())
    vitePlugins.push(createSvgIcon(isBuild))
    isBuild && vitePlugins.push(...createCompression(viteEnv))
    return vitePlugins
}
