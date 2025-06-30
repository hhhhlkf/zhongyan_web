/*
 * @Author: pmy
 * @Date: 2023-08-09 10:16:50
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-05 09:38:46
 * @FilePath: \web\vite.config.js
 * @Description: 配置文件
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
import os from 'os'


function getWiredIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log('wired ip is:', iface.address);
                return iface.address;
            }
        }
    }
    // console.log('can not find wired ip, use 127.0.0.1');
    return '127.0.0.1';
}

const wiredIP = getWiredIPAddress();
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
    const env = loadEnv(mode, process.cwd())
    const { VITE_APP_ENV } = env

    return {
        // 部署生产环境和开发环境下的URL。
        // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
        // 例如 https://www.exsun/。
        // 如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.exsun/admin/，则设置 baseUrl 为 /admin/。
        base: VITE_APP_ENV === 'production' ? '/' : '/',
        plugins: createVitePlugins(env, command === 'build'),
        resolve: {
            // https://cn.vitejs.dev/config/#resolve-alias
            alias: {
                // 设置路径
                '~': path.resolve(__dirname, './'),
                // 设置别名
                '@': path.resolve(__dirname, './src')
            },
            // https://cn.vitejs.dev/config/#resolve-extensions
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        },
        // vite 相关配置
        server: {
            host: '0.0.0.0',
            port: 3010,
            open: true,
            headers: {
                'Cache-Control': 'no-store'
            },
            proxy: {
                '/v2': {
                    target: `http://${wiredIP}:8088`,
                    changeOrigin: true,
                },
                // https://cn.vitejs.dev/config/#server-proxy
                '/v1': {
                    // target: 'http://192.168.2.226:8080', // lw
                    // target: 'http://192.168.2.196:8080', // ct
                    target: 'https://apifoxmock.com/m1/4959231-4617195-default', // 测试
                    // target: 'http://192.168.10.102:8080', // 正式
                    changeOrigin: true,
                },

            }
        },
        //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule) => {
                                if (atRule.name === 'charset') {
                                    atRule.remove();
                                }
                            }
                        }
                    }
                ]
            }
        }
    }
})

