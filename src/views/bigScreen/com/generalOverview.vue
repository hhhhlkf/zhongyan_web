<!--
 * @Author: nxx
 * @Date: 2024-01-04 15:27:26
 * @LastEditors: hhhhlkf 153648356@qq.com
 * @LastEditTime: 2025-06-16 22:52:24
 * @FilePath: \web\src\views\bigScreen\com\generalOverview.vue
 * @Description: 总体概览
 * Copyright (c) 2024 by nxx/exsun, All Rights Reserved. 
-->
<template>
    <div class="generalOverview">
        <div class="table-wrap">
        <el-table class="dataTable" :data="dataList" height="100%" size='small'
            style="--el-table-border-color: none;border-right: 1px #143275 solid;border-left: 1px #143275 solid;border-bottom: 1px #143275 solid;"
            :highlight-current-row="false" header-cell-class-name="headerClass"
            :header-cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderLeft: '0.5px #154480 solid', borderBottom: '1px #154480 solid' }"
            :cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderBottom: '0.5px #143275 solid', borderLeft: '0.5px #143275 solid' }"
            :row-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', }" :row-class-name="tableRowClassName">
            <el-table-column prop="data.fileName" label="文件名称" />
            <el-table-column label="选择" width="80">
                <!-- <el-checkbox v-model="selected"></el-checkbox> -->
                <template v-slot="scope">
                    <el-checkbox v-model="scope.row.selected" :disabled="scope.row.isShp"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="是否展示" width="80">
                <!-- <el-checkbox v-model="selected"></el-checkbox> -->
                <template v-slot="scope">
                    <el-checkbox v-model="scope.row.showed"></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="data.fileDate" label="接收时间" />
            <el-table-column prop="data.fileSize" label="文件大小">
                <template #default="{ row }">
                    {{ row.data.fileSize }} KB
                </template>
            </el-table-column>
            <el-table-column prop="data.lngmax" label="坐标" />


        </el-table>
        </div>

        <div class="button-container-below">
            <el-button style="color:azure;margin-left: 5px;margin-bottom: 5px;" @click="openDialog('load')">
                导入数据
            </el-button>
            <el-button style="color:azure;margin-left: 5px;margin-bottom: 5px;" @click="openDialog('del')">
                删除数据
            </el-button>
            <el-button style="color:azure;margin-left: 5px;margin-bottom: 5px;" @click="showDisaster">
                灾害现场
            </el-button>
            <el-button style="color:azure;margin-left: 5px;margin-bottom: 5px;" @click="closeDisaster">
                关闭现场
            </el-button>
            <el-dialog title="导入数据" v-model="dialogVisible.load" width="20%" @close="closeDialog('load')">
                <!-- <span>选择导入数据的路径</span> -->
                <div class="upload-row">
                    <el-upload ref="uploadRef" class="upload-demo" action="" :on-progress="handleProgress"
                        :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload"
                        :auto-upload="false">
                        <template #trigger>
                            <el-button class="dialog-btn" type="primary">选取文件</el-button>
                        </template>

                        <el-button class="dialog-btn" type="primary" @click="submitUpload">
                            upload to server
                        </el-button>
                    </el-upload>
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible.load = false">取消</el-button>
                        <el-button @click="confirmDialog('load')">确认</el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog title="删除数据" v-model="dialogVisible.del" width="20%" @close="closeDialog('del')">
                <span>是否删除所选的文件</span>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible.del = false">取消</el-button>
                        <el-button @click="confirmDialog('del')">确认</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue';
import { addFile, delSelectedData, processResult } from '../../../api/zhongyan/api';
import { ElMessage } from 'element-plus';

let dataList = reactive([])
let dialogVisible = ref({
    load: false,
    del: false
})

let props = defineProps(['showgraphic', 'showDisaster', 'closeDisaster', 'generView'])
const { generView } = toRefs(props)
let selectedFile = ref(null)


watch(generView, (newVal, oldVal) => {
    // console.log('generView changed is here')
    getProcessResult()
})

function beforeUpload(file) {

    selectedFile.value = file
    // console.log(`文件名称：${file.name}`)
    // console.log(`文件大小：${file.size} bytes`)
}

function showDisaster() {
    props.showDisaster("dongtinghu")
}

function closeDisaster() {
    props.closeDisaster()
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getProcessResult() {

    processResult(['emergency'], true).then(res => {
        if (res.code === 200) {
            ElMessage({
                message: '获取数据成功',
                type: 'success'
            })

            let serverpath = null
            //清空dataList
            dataList.splice(0, dataList.length)
            res.data.fileList.forEach(item => {
                // console.log("item: ",item.fileName.includes('landcover'))
                dataList.push({
                    data: item,
                    selected: false,
                    showed: false,
                    hasLegend: item.fileName.includes('landcover'),
                    isShp: false
                })
                serverpath = item.path.replace(/\/[^\/]*\/[^\/]*$/, '');
            })
            // console.log(serverpath + '/Economic_Belt.zip')
            if (serverpath == null) {
                serverpath = "127.0.0.1:8088/v2/static"
            }
            // 载入矢量图
            // 载入矢量图
            dataList.unshift({
                data: {
                    path: serverpath + '/four.zip',
                    fileName: '四省图',
                    fileDate: getCurrentDate(),
                    fileSize: 72,
                    id: 'shpLayer3'
                },
                selected: false,
                showed: false,
                hasLegend: false,
                isShp: true
            })
            dataList.unshift({
                data: {
                    path: serverpath + '/province.zip',
                    fileName: '长江图',
                    fileDate: getCurrentDate(),
                    fileSize: 72,
                    id: 'shpLayer2'
                },
                selected: false,
                showed: false,
                hasLegend: false,
                isShp: true
            })
            dataList.unshift({
                data: {
                    path: serverpath + '/Economic_Belt.zip',
                    fileName: '长江经济带矢量图',
                    fileDate: getCurrentDate(),
                    fileSize: 119,
                    id: 'shpLayer1'
                },
                selected: false,
                showed: false,
                hasLegend: false,
                isShp: true
            })
        }

    }).catch(err => {
        console.log(err)
    })
}

onMounted(() => {
    // console.log('mounted')
    getProcessResult()
})

let tableRowClassName = ({ row, rowIndex }) => {
    if (rowIndex % 2 == 0) {
        return "";
    } else {
        return "warning-row";
    }

};

function openDialog(type) {
    // console.log(`${type}Ready`);
    dialogVisible.value[type] = true;
}

function closeDialog(type) {
    dialogVisible.value[type] = false;
}

function confirmDialog(type) {
    dialogVisible.value[type] = false;
    if (type === 'del') {
        // 选出选中的文件
        const selectedFiles = dataList.filter(item => item.selected);
        // 将选中的文件的名字item.data.fileName放入数组中
        const selectedFilesName = selectedFiles.map(item => item.data.fileName);
        for (let i = 0; i < selectedFilesName.length; i++) {
            selectedFilesName[i] = selectedFilesName[i].replace(/^emergency_/, '')
        }
        delSelectedData(selectedFilesName).then(res => {
            if (res.code === 200) {
                ElMessage({
                    message: '删除数据成功',
                    type: 'success'
                })
                // 删除成功后修改dataList
                for (let i = dataList.length - 1; i >= 0; i--) {
                    if (dataList[i].selected) {
                        dataList.splice(i, 1);
                    }
                }
                // console.log(dataList.length)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    else {

    }
    // console.log(`${type}Confirm`);
}

function handleProgress(event, file, fileList) {
    return
}

function handleSuccess(response, file, fileList) {
    return

}

watch(() => JSON.parse(JSON.stringify(dataList)), (newVal, oldVal) => {
    const newValJson = JSON.stringify(newVal);
    const oldValJson = JSON.stringify(oldVal);
    if (newValJson !== oldValJson) {
        // console.log('dataList changed')
    }
    oldVal.forEach((oldItem, index) => {
        const newItem = newVal[index];
        if (newItem != undefined) {
            // console.log(newItem, oldItem)
            if (oldItem.showed != newItem.showed && !newItem.isShp) {
                props.showgraphic(newItem.data.lngmax, newItem.data.lngmin, newItem.data.latmax,
                    newItem.data.latmin, newItem.data.id, newItem.showed, newItem.data.path, newItem.hasLegend)
            }
            else if (oldItem.showed != newItem.showed && newItem.isShp) {
                props.showgraphic(null, null, null, null, newItem.data.id, newItem.showed, newItem.data.path, newItem.hasLegend, newItem.isShp)
            }
        }

    });
}, { deep: true })

function handleError(err, file, fileList) {

    // console.log(file)
    addFile(file.name).then(res => {
        if (res.code === 200) {
            ElMessage({
                message: '上传数据成功',
                type: 'success'
            })
            res.data.fileList.forEach(item => {
                // console.log("item: ",item.fileName.includes('landcover'))
                dataList.push({
                    data: item,
                    selected: false,
                    showed: false,
                    hasLegend: item.fileName.includes('landcover'),
                    isShp: false
                })
            })
        }
    }).catch(err => {
        console.log(err)
    })

}
let uploadRef = ref(null)
function submitUpload() {
    uploadRef.value.submit();
}

</script>
<style lang="scss" scoped>
.generalOverview {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    /* 将按钮水平居中对齐 */
    gap: 10px;
    /* 添加按钮之间的间距 */
    width: 100%;
    /* 父 div 的宽度 */
    height: 100%;
    /* 父 div 的高度 */
    background: url("@/assets/img/bigScreen/highChart/back-h.png") center no-repeat;
    background-size: 100% 100%;
    padding: 35px 0 62px;
    box-sizing: border-box;
    min-height: 0;
    overflow: hidden;
}

.dataTable {
    width: calc(100% - 35px);
    margin: 0 auto;
    cursor: pointer;
    /* 确保表格和下方按钮容器之间有足够的间距 */
}

.table-wrap {
    flex: 0 1 auto;
    height: calc(100% - 40px);
    min-height: 0;
    max-height: calc(100% - 30px);
    overflow: hidden;
    margin-top: 16px;
}

.li-name {
    text-decoration: underline;
    margin-bottom: 1px;

}

.li-name:hover {
    color: rgb(31, 180, 225);
}

.el-carousel__item h3 {
    color: #476769;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;

}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf !important;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6 !important;
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



::v-deep .el-table__header th {
    background: #175d83 !important;
}

/* // 表格斑马自定义颜色 */
::v-deep .el-table__row.warning-row {
    background: #175d83;
}

::v-deep(.dataTable .el-table__body tr:hover > td) {
    background-color: rgba(0, 0, 0, 0.05) !important;
}

::v-deep(.dataTable .el-table__body tr.warning-row:hover > td) {
    background-color: #25627f !important;
}



.button-container-below {
    position: absolute;
    /* 子级 div 设置为绝对定位 */
    bottom: 0;
    /* 将子级 div 定位到父级 div 的底部 */
    width: 100%;
    /* 根据需要设置宽度 */
    display: flex;
    justify-content: center;
    /* 按钮水平居中对齐 */
    gap: 10px;
    /* 按钮之间的间距 */
    flex-wrap: wrap;
    padding: 0 12px;
    box-sizing: border-box;
    min-height: 52px;
}

.upload-row {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;

    /* 调整按钮之间的间距 */
}

.upload-demo {
    text-align: center;
    /* 使按钮容器内的内容居中 */
    margin-top: 20px;
    /* 根据需要调整顶部间距 */
}

.dialog-btn {
    margin: 0 5px;
    /* 调整按钮之间的间距 */
}
</style>
