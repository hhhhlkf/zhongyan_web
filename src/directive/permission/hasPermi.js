/*
 * @Author: pmy
 * @Date: 2023-08-11 09:10:42
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-31 09:43:46
 * @FilePath: \system\src\directive\permission\hasPermi.js
 * @Description: v-hasPermi 操作权限处理
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */

import useUserStore from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    const { value } = binding
    if (value && value instanceof Array && value.length > 0) {
      if (!hasPermissions(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}

export function hasPermissions(permissionFlag) {
  const all_permission = "*:*:*";
  const permissions = useUserStore().permissions;
  return permissions.some(permission => {
    return all_permission === permission || permissionFlag.includes(permission)
  })
}