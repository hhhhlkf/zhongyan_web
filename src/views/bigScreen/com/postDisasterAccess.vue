<!--
 * @Author: nxx
 * @Date: 2024-01-04 15:27:26
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-11 08:44:55
 * @FilePath: \web\src\views\bigScreen\com\timingSystem.vue
 * @Description: 高精度授时服务
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>
    <div class="div-body">

        <div class="top">
            <div v-show="showtuli2">
                <span style="margin-left: 5px;">解译结果</span>
                <br>
                <img src="http://localhost:8601/tuli/2.png" alt=""
                    style="margin-left: 50px;width: 300px;z-index: 99999;">
            </div>
            <div class="top" v-show="!showtuli2">
                <span style="margin-left: 5px;">灾害数据列表</span>
                <el-table class="dataTable" :data="tableData" height="250" size='small'
                    style="margin-top: 5px;width: 99.97%;--el-table-border-color: none;border-right: 1px #143275 solid;border-left: 1px #143275 solid;border-bottom: 1px #143275 solid;"
                    :highlight-current-row="false" header-cell-class-name="headerClass"
                    :header-cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderLeft: '0.5px #154480 solid', borderBottom: '1px #154480 solid' }"
                    :cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderBottom: '0.5px #143275 solid', borderLeft: '0.5px #143275 solid' }"
                    :row-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', }"
                    :row-class-name="tableRowClassName">
                    <el-table-column prop="name" label="数据类型" width="100" />
                    <el-table-column prop="type" label="传感器类型" width="100" />
                    <el-table-column prop="resolution" label="空间分辨率/米" width="125" />
                    <el-table-column prop="num" label="数量/景" width="75" />

                </el-table>
            </div>
            <el-button @click="startWork()" style="color:azure;margin-left: 10px;margin-bottom: 5px;">
                开始解译
            </el-button>
            <br>
            <span style="margin-left: 10px;color:dimgray;font-size: 15px;">解译进度</span>
            <el-progress :percentage="percentage" :stroke-width="15" style="margin-left: 10px;margin-top: 5px;" />
            <img src="http://localhost:8601/tuli/1.png" v-show="shoutuli" alt="" style="width: 400px;margin-top: 10px;">
        </div>

        <div class="bottom">

        </div>
    </div>
</template>

<script setup>

let props = defineProps(['startWork'])
let percentage = ref(0)
let shoutuli = false
let showtuli2 = ref(false)
const tableData = [
    {
        name: 'GF1',
        type: '全色/多光谱',
        resolution: '2/8/16',
        num: '40',
    },
    {
        name: 'GF2',
        type: '全色/多光谱',
        resolution: '0.8/3.2',
        num: '21',
    },
    {
        name: 'GF6',
        type: '全色/多光谱',
        resolution: '2/8/16',
        num: '9',
    },
    {
        name: 'BJ3',
        type: '全色/多光谱',
        resolution: '0.5/2',
        num: '5',
    },
    {
        name: 'HJ2A',
        type: '多光谱',
        resolution: '16',
        num: '1',
    },
    {
        name: 'JL1',
        type: '全色/多光谱',
        resolution: '0.72/2.88',
        num: '36',
    },

]

let timer = null
function startWork() {
    shoutuli = true
    props.startWork()
    percentage.value = 0
    setTimeout(() => {
        timer = setInterval(() => {
            percentage.value = percentage.value + 5

        }, 900);
    }, 3000)

}

watch(
    percentage,
    (newValue, oldValue) => {
        if (newValue >= 100) {
            clearInterval(timer)
            timer = null
            showtuli2.value = true
        }
    }
)

const tableRowClassName = ({ row, rowIndex }) => {

    if (rowIndex % 2 == 0) {
        return "";
    } else {
        return "warning-row";
    }

};


watch(
    // props,
    // (newValue, oldValue) => {
    //     if (props.infoType) {
    //         activeType.value = props.infoType
    //     } else {
    //         activeType.value = ''
    //     }
    //     if (props.active) {
    //         activeService.value = props.active
    //     }
    // },
)

</script>

<style scoped>
.demo-progress .el-progress--line {
    margin-bottom: 15px;
    max-width: 600px;
}


.dataTable:hover {
    cursor: pointer;
}

.newsImg {
    width: inherit
}

.top {
    width: 100%;
    margin-bottom: 20px;
}

.li-name {
    text-decoration: underline;
    margin-bottom: 1px;

}

.li-name:hover {
    color: rgb(31, 180, 225);
}

.div-body {
    width: 100%;
    box-sizing: border-box;
    position: relative;

    justify-content: space-around;
    align-items: center;
    background: url("@/assets/img/bigScreen/highChart/back-h.png") center no-repeat;
    background-size: 100% 100%;
    padding-top: 5%;

}

.el-carousel__item h3 {
    color: #476769;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;

}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}


/*  
// 表格部分样式
 // 最外层透明 */
:deep .el-table,
:deep .el-table__expanded-cell {
    background-color: transparent;
    border: 0px solid !important;
}

/* 表格内背景颜色  */

::v-deep .el-table tr {
    background-color: transparent;
    height: 5px;
}

/* // 去掉最下面的那一条线  */
.el-table::before {
    height: 0px;
}

/* // 设置表格行高度 */
::v-deep .el-table__body tr {
    padding: 0;
    height: 40px;
}

/* // 表格斑马自定义颜色 */
::v-deep .el-table__row.warning-row {
    background: #01515a;
}

::v-deep .el-table__header th {
    background: #175d83 !important;
}

::v-deep .el-button {
    background: rgba(2, 98, 111, 0.7) !important;

    border: 0px !important;
}

/* el-button按钮悬浮变浅 */
::v-deep .el-button:hover {
    background: rgba(2, 98, 111, 0.9) !important;
}
</style>