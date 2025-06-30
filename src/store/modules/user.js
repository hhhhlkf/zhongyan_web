/*
 * @Author: tzq
 * @Date: 2023-09-26 10:35:46
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-13 14:48:53
 * @FilePath: \bdcar-net\src\store\modules\user.js
 * @Description: 
 * Copyright (c) 2023 by tzq/exsun, All Rights Reserved. 
 */
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/img/profile.jpg'
import Cookies from 'js-cookie'

const useUserStore = defineStore(
    'user',
    {
        state: () => ({
            token: getToken(),
            name: '',
            avatar: '',
            roles: [],
            permissions: [],
            info: {},
            deptIds: {},
        }),
        actions: {
            // 登录
            login(userInfo) {
                const username = userInfo.username.trim()
                const password = userInfo.password
                const code = userInfo.code
                const uuid = userInfo.uuid
                return new Promise((resolve, reject) => {
                    login(username, password, code, uuid).then(res => {

                        setToken(res.token)
                        Cookies.set("HfysToken", res.hfysToken)
                        // setToken(res.hfysToken)
                        // 解决单点登录新增代码-start
                        // setToken(res.mineToken, 'mine-Token') // 应急
                        // setToken(res.agriToken, 'agri-Token')// 农业
                        // end
                        this.token = res.token
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            // 获取用户信息
            getInfo() {
                return new Promise((resolve, reject) => {
                    getInfo().then(res => {
                        const user = res.user
                        const avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;

                        if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
                            this.roles = res.roles
                            this.permissions = res.permissions
                        } else {
                            this.roles = ['ROLE_DEFAULT']
                        }
                        this.name = user.userName
                        this.avatar = avatar;
                        this.info = user;
                        if (res.deptIds) this.deptIds = res.deptIds;
                        resolve(res)
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            // 退出系统
            logOut() {
                return new Promise((resolve, reject) => {
                    logout(this.token).then(() => {
                        this.token = ''
                        this.roles = []
                        this.permissions = []
                        removeToken()
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            }
        }
    })

export default useUserStore
