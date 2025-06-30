/*
 * @Author: pmy
 * @Date: 2023-09-13 10:27:21
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-31 14:47:26
 * @FilePath: \system\src\api\tree.js
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
export const useData = () => {
    const treeNodeImg = ref(["company", "department", "car", "people", "channel", "", "", "", "", "", ""]);
    const myTree = ref(null);
    const showTree = ref(true);
    const loading = ref(false);
    const filterText = ref('');
    const expandedkeys = ref([]);
    let timer = null;
    function debounce(func) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(function () {
            func.call()
        }, 300)
    }
    return {
        treeNodeImg,
        myTree,
        showTree,
        loading,
        expandedkeys,
        filterText,
        debounce
    }
}