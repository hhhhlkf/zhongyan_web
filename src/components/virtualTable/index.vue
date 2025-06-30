<!--
 * @Author: pmy
 * @Date: 2023-09-23 14:50:48
 * @LastEditors: pmy
 * @LastEditTime: 2023-10-25 10:05:19
 * @FilePath: \bdcar-net\src\components\virtualTable\index.vue
 * @Description: 虚拟表
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
-->
<template>
    <el-auto-resizer>
        <template #default="{ height, width }">
            <el-table-v2 :columns="props.columns" :data="filterData" :width="width" :height="height" fixed
                :estimated-row-height="36" ref="v2Table">
                <template #header="header">
                    <div v-for="v in header.columns" class="el-table-v2__header-cell" style="flex: 0 0 auto;"
                        :style="{ width: v.width + 'px' }" :class="{ 'flex-row-cell': v.width === null }">
                        <slot name="headerItem" :data="v">
                            <div class="el-table-v2__header-cell-text">{{ v.title }}</div>
                            <template v-if="v.sortable">
                                <el-icon @click="sortDataByKey(v)">
                                    <Sort v-if="sortState[v.key] === null" />
                                    <SortDown v-else-if="sortState[v.key] === true" />
                                    <SortUp v-else-if="sortState[v.key] === false" />
                                </el-icon>
                            </template>
                        </slot>
                    </div>
                </template>
                <template #row="row">
                    <div class="el-table-v2__row-cell" style="flex:0 0 auto" :style="{ width: v.width + 'px' }"
                        v-for="v in row.columns" @click="rowClick(row.rowData, recognizeKey(row))"
                        :class="{ 'flex-row-cell': v.width === null, 'active': active == recognizeKey(row) }">
                        <slot name="rowItem" :rowData="row.rowData" :rowIndex="row.rowIndex" :column="v">
                            <span v-if="v.key === 'index'">{{ row.rowIndex + 1 }}</span>
                            <span>{{ row.rowData[v.key] }}</span>
                        </slot>
                    </div>
                </template>
            </el-table-v2>
        </template>
    </el-auto-resizer>
</template>
<script setup>
import { computed } from 'vue';
const active = ref(-1);
// 记录每个sort表头的状态
const sortState = ref({});
// 记录最后一次sort的key，当数据自动更新的时候以这个key为准sort排序
const currentKey = ref(null);
const props = defineProps({
    columns: { type: Array, default: [] },
    data: { type: Array, default: [] },
    click: { type: Function, default: () => { } },
    rowCancel: { type: Function, default: null },
    activeKey: { type: String }
})
function rowClick(data, key) {
    if (active.value == key && props.rowCancel) {
        props.rowCancel(data, key);
        setActiveKey(-1);
        return
    }
    setActiveKey(key);
    props.click(data, key);
}
props.columns.forEach(v => {
    if (v.sortable) {
        sortState.value[v.key] = null; //true顺序 false倒序
    }
})
const filterData = computed(() => {
    let key = currentKey.value
    let list = props.data;
    if (key) {
        list = props.data.sort((a, b) => {
            // 通过调换after before控制升序降序
            let before = b, after = a;
            if (sortState.value[key]) {
                before = a; after = b;
            }
            // 如果localeCompare存在则使用string的localeCompare方法，否则默认是数字用减法
            return before[key].localeCompare ? before[key].localeCompare(after[key]) : before[key] - after[key]
        });
    }
    return list;
})
// 如果定义了高亮唯一识别，就使用定义的，否则使用rowindex
function recognizeKey(row) {
    return props.activeKey ? row.rowData[props.activeKey] : row.rowIndex
}
const sortDataByKey = ({ key }) => {
    if (sortState.value[key] === null) {
        sortState.value[key] = true;
    } else {
        sortState.value[key] = !sortState.value[key];
    }
    currentKey.value = key;
}
const v2Table = ref(null);
const vtScrollToTop = () => {
    nextTick(() => {
        v2Table.value.scrollToTop(0);
    })
}
const setActiveKey = (key) => {
    active.value = key;
}
defineExpose({
    v2Table,
    vtScrollToTop,
    setActiveKey
})
</script>
<style lang='scss' scoped>
.el-icon {
    margin-left: 2px;
    cursor: pointer;
}
</style>