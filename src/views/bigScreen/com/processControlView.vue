<template>
    <div class="processCtrlBlock" v-if="props.processCtrlData == 1">
        <el-dialog title="确认操作" v-model="dialogVisible.tr" width="30%" @close="closeDialog('tr')">
            <span>是否需要开启边缘设备的实时采集和压缩？</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible.tr = false">取消</el-button>
                    <el-button @click="confirmDialog('tr')">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog title="流程控制确认" v-model="controlConfirmDialog.visible" width="30%"
            @close="closeControlConfirmDialog">
            <span>{{ controlConfirmDialog.message }}</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeControlConfirmDialog">取消</el-button>
                    <el-button type="primary" @click="confirmControlAction">确认</el-button>
                </span>
            </template>
        </el-dialog>

        <div class="processCtrlContent" :class="{ 'processCtrlContent--expanded': workbenchVisible }">
            <div v-if="workbenchVisible" class="processWorkbenchWrapper">
                <ProcessWorkbench :visible="workbenchVisible" :modal-type="currentModalType"
                    :modal-options="modalOptions"
                    :modal-config="currentModalConfig" :collect-list="currentCollectList"
                    :process-list="currentProcessList" :history-list="currentHistoryList"
                    :collect-pagination="currentCollectPagination" :process-pagination="currentProcessPagination" :history-pagination="currentHistoryPagination"
                    :collect-selected-ids="currentCollectSelectedIds" :process-selected-ids="currentProcessSelectedIds"
                    :history-selected-ids="currentHistorySelectedIds" :collect-delete-disabled="currentCollectDeleteDisabled"
                    :process-delete-disabled="currentProcessDeleteDisabled" :history-delete-disabled="currentHistoryDeleteDisabled"
                    :collect-delete-disabled-reason="currentCollectDeleteDisabledReason"
                    :process-delete-disabled-reason="currentProcessDeleteDisabledReason"
                    :history-delete-disabled-reason="currentHistoryDeleteDisabledReason"
                    :collect-deleting="currentCollectDeleting" :process-deleting="currentProcessDeleting"
                    :history-deleting="currentHistoryDeleting"
                    :is-collecting="isCollecting[currentModalType]" :is-interpretate="isInterpretate[currentModalType]" :running="currentWorkbenchRunning"
                    :workbench-status="currentWorkbenchStatus" :camera-speed="cameraSpeed[currentModalType]"
                    :rgb-capture-config="currentRgbCaptureConfig" :is-uav-visible="isRealtimeUavVisible[currentModalType]"
                    :table-height="workbenchTableHeight" :row-class-name="getRowClassName"
                    @close="closeWorkbench" @capture-toggle-request="openControlConfirmDialog"
                    @process-toggle-request="openProcessConfirmDialog"
                    @uav-visibility-toggle-request="handleRealtimeUavVisibility"
                    @modal-change="handleModalChange"
                    @transfer="dataTransfer" @recent-page-change="handleRecentPageChange"
                    @history-page-change="handleHistoryPageChange"
                    @toggle-selection="updateSelection" @toggle-select-all="updateSelectionForPage"
                    @batch-delete="handleBatchDelete" @delete-item="handleDeleteItem"
                    @update:camera-speed="(value) => updateCameraSpeed(currentModalType, value)"
                    @update:rgb-capture-config="(patch, options) => updateRgbCaptureConfig(currentModalType, patch, options)" />
            </div>

            <el-table v-else class="dataTable" :data="processGraphicQueue" height="350" size='small'
                style="--el-table-border-color: none;border-right: 1px #143275 solid;border-left: 1px #143275 solid;border-bottom: 1px #143275 solid;"
                :highlight-current-row="false" header-cell-class-name="headerClass"
                :header-cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderLeft: '0.5px #154480 solid', borderBottom: '1px #154480 solid' }"
                :cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderBottom: '0.5px #143275 solid', borderLeft: '0.5px #143275 solid' }"
                :row-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', }" :row-class-name="tableRowClassName">
                <el-table-column prop="name" label="文件名称" width="160" />
                <el-table-column prop="type" label="接收时间" width="160" />
                <el-table-column label="是否展示" width="80">
                    <template v-slot="scope">
                        <el-checkbox v-model="scope.row.graphic"></el-checkbox>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div v-if="!workbenchVisible" class="button-container-below">
            <el-button style="color:azure;margin-left: 10px;margin-bottom: 5px;" @click="openDialog('cp')"
                :disabled="isdisabledBtn.cp">
                处理开始
            </el-button>
            <!-- <el-button style="color:azure;margin-left: 10px;margin-bottom: 5px;" @click="openDialog('trs')"
                :disabled="isdisabledBtn.trs">
                采集停止
            </el-button> -->
            <el-button style="color:azure;margin-left: 10px;margin-bottom: 5px;" @click="openDialog('cps')"
                :disabled="isdisabledBtn.cps">
                处理停止
            </el-button>
            <el-dialog title="确认操作" v-model="dialogVisible.cp" width="30%" @close="closeDialog('cp')">
                <span>是否需要开启边缘设备的实时处理？</span>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible.cp = false">取消</el-button>
                        <el-button @click="confirmDialog('cp')">确认</el-button>
                    </span>
                </template>
            </el-dialog>
            <el-dialog title="确认操作" v-model="dialogVisible.cps" width="30%" @close="closeDialog('cps')">
                <span>是否需要关闭边缘设备的实时处理？</span>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible.cps = false">取消</el-button>
                        <el-button @click="confirmDialog('cps')">确认</el-button>
                    </span>
                </template>
            </el-dialog>
            <!-- <el-dialog title="确认操作" v-model="dialogVisible.trs" width="30%" @close="closeDialog('trs')">
                <span>是否需要关闭边缘设备的实时采集</span>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible.trs = false">取消</el-button>
                        <el-button @click="confirmDialog('trs')">确认</el-button>
                    </span>
                </template>
            </el-dialog> -->
        </div>

    </div>
    <div class="processCtrlBlock" v-else>
        <div class="button-container-above-1">
            <!-- <el-button style="color:azure;margin-left: 10px;margin-bottom: 5px;" @click="openDialog('rma')">
                配准-制图-损毁评估
            </el-button> -->
            <div class="page-btn btn_1 screen-detail" @click="openDialog('rma', 1)">配准</div>
            <div class="page-btn btn_2 screen-detail" @click="openDialog('rma', 2)">制图</div>
            <div class="page-btn btn_3 screen-detail" @click="openDialog('rma', 3)">评估</div>
        </div>
        <el-dialog title="文件上传操作" v-model="dialogVisible.rma" width="30%" @close="closeDialog('rma')">
            <div class="upload-container">
                <div class="upload-row">
                    <el-upload ref="uploadRef" class="upload-demo" :file-list="fileList" action=""
                        :on-progress="handleProgress" :on-success="handleSuccess" :on-error="handleError"
                        :auto-upload="false" :before-upload="beforeUpload">
                        <el-button type="primary" class="change-path-btn">选取文件</el-button>
                    </el-upload>
                    <!-- <el-input v-model="filePath" placeholder="输入文件路径" class="file-path-input"></el-input> -->
                    <!--  readonly -->
                    <!-- <el-button type="primary" @click="changePath">修改路径</el-button> -->
                </div>
                <div class="progress-container">
                    <span>处理进度</span>
                    <el-progress :percentage="uploadProgress" class="upload-progress"></el-progress>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="rmaClose">取消</el-button>
                    <el-button @click="submitUpload">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- <el-table class="dataTable" :data="processList" height="250" size='small'
            style="--el-table-border-color: none;border-right: 1px #143275 solid;border-left: 1px #143275 solid;border-bottom: 1px #143275 solid;"
            :highlight-current-row="false" header-cell-class-name="headerClass"
            :header-cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderLeft: '0.5px #154480 solid', borderBottom: '1px #154480 solid' }"
            :cell-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', borderBottom: '0.5px #143275 solid', borderLeft: '0.5px #143275 solid' }"
            :row-style="{ color: '#fff', fontSize: '14px', textAlign: 'center', }" :row-class-name="tableRowClassName">
            <el-table-column prop="data.fileName" label="处理图像名称" width="120" />
            <el-table-column prop="data.fileDate" label="接收时间" width="120" />
            <el-table-column label="配准、制图、评估" width="180"> -->
        <!-- <el-checkbox v-model="selected"></el-checkbox> -->
        <!-- <template v-slot="scope">
                    <el-checkbox v-model="scope.row.selected[0]"></el-checkbox>
                    <el-checkbox v-model="scope.row.selected[1]"></el-checkbox>
                    <el-checkbox v-model="scope.row.selected[2]"></el-checkbox>
                </template> -->
        <!-- </el-table-column>  -->

        <!-- </el-table> -->
    </div>
</template>



<script setup>
import { computed, ref, onMounted, onBeforeUnmount, reactive, toRefs, watch } from 'vue'
import { getProcess2Result, process2List, startControl, getRealtimeUavInfo } from '../../../api/zhongyan/api';
import {
    getRecentData,
    cameraControl,
    startRgbTimelapseForever,
    startRgbTimelapse,
    restartRgbTimelapseForever,
    restartRgbTimelapse,
    stopRgbCamera,
    selectMethod,
    getHistoryList,
    transferData,
    deleteDataItems,
    clearDataItems
} from '@/api/zhongyan/dataManager';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useProcessStore } from "../../../store/modules/process";
import { modalConfigs, modalList } from './processControl/modalConfig';
import ProcessWorkbench from './processControl/ProcessWorkbench.vue';


// onMounted(() => {
//     console.log('mounted')
//     process2List().then(res => {
//         console.log(res);
//         ElMessage({
//             message: res.message,
//             type: 'success'
//         })
//         res.data.fileList.forEach(item => {
//             processList.push({ data: item, selected: [false, false, false] })
//         });
//     }).catch(err => {
//         console.log(err);
//     });
// })

// let processList = reactive([])

// watch(() => JSON.parse(JSON.stringify(processList)), (newVal, oldVal) => {
//     console.log(newVal);
//     console.log(oldVal);

//     oldVal.forEach((oldItem, index) => {
//         const newItem = newVal[index];
//         oldItem.selected.forEach((oldSelected, selectedIndex) => {
//             if (oldSelected != newItem.selected[selectedIndex]) {
//                 console.log(`Item at index ${index} has changed selected at position ${selectedIndex}:`, newItem.selected[selectedIndex]);
//                 props.showgraphic(newItem.data.lngmax, newItem.data.lngmin, newItem.data.latmax,
//                     newItem.data.latmin, newItem.data.id[selectedIndex], newItem.selected[selectedIndex], newItem.data.path[selectedIndex])
//             }
//         });
//     });
// }, { deep: true })

// 采集处理传输控制变量

let processStore = useProcessStore()


// 获取表格行的样式，使得表格呈现斑马纹效果
const getRowClassName = ({ row, rowIndex }) => {
    return rowIndex % 2 == 0 ? 'even-row' : 'odd-row';
};

// 多模态数据定义
const modalities = ['rgb', 'llt', 'hsi'];
const currentModalType = ref('rgb');
const modalOptions = modalList;
const listPageSizeMap = {
    collect: 10,
    process: 10,
    history: 5,
};
const workbenchTableHeight = 250;
const RGB_MODAL = 'rgb';
const RGB_CAPTURE_MODE = {
    FOREVER: 'forever',
    COUNT: 'count',
};


let cameraSpeed = reactive({});// 相机速度
let isCollecting = reactive({});// 是否正在采集
let isInterpretate = reactive({});// 是否正在解译
let captureIntervalIds = reactive({}); // 用于存储每个模态的定时器 ID
let processIntervalIds = reactive({}); // 用于存储每个模态的处理定时器 ID
let isRealtimeUavVisible = reactive({});
let realtimeUavPollingIds = reactive({});
let rgbCaptureConfig = reactive({});
const paginationState = reactive({});
const workbenchVisible = ref(false);
const controlConfirmDialog = reactive({
    visible: false,
    modal: 'rgb',
    type: 'capture',
    nextState: false,
    message: '',
});
const selectionState = reactive({});
const deletingState = reactive({});

function createDefaultRgbCaptureConfig() {
    return {
        captureMode: RGB_CAPTURE_MODE.FOREVER,
        interval: 3,
        count: 10,
        mac: '',
    };
}

modalities.forEach(modality => {
    cameraSpeed[modality] = modalConfigs[modality]?.speedMin ?? 0;
    isCollecting[modality] = false;
    isInterpretate[modality] = false;
    isRealtimeUavVisible[modality] = false;
    if (modality === RGB_MODAL) {
        rgbCaptureConfig[modality] = createDefaultRgbCaptureConfig();
    }
    paginationState[modality] = {
        collect: 1,
        process: 1,
        history: 1,
    };
    selectionState[modality] = {
        collect: [],
        process: [],
        history: [],
    };
    deletingState[modality] = {
        collect: false,
        process: false,
        history: false,
    };
});

function toggleWorkbenchVisible() {
    setWorkbenchVisible(!workbenchVisible.value);
}

function closeWorkbench() {
    stopRealtimeUavVisibility(RGB_MODAL);
    setWorkbenchVisible(false);
}

function openWorkbench() {
    setWorkbenchVisible(true);
}

// Key change: keep a single source of truth for workbench visibility and sync it to the parent.
function setWorkbenchVisible(visible) {
    workbenchVisible.value = visible;
    emit('workbench-visible-change', visible);
}

defineExpose({
    openWorkbench,
})

function updateCameraSpeed(modal, value) {
    cameraSpeed[modal] = value;
}

function getRgbCaptureConfig(modal = RGB_MODAL) {
    if (!rgbCaptureConfig[modal]) {
        rgbCaptureConfig[modal] = createDefaultRgbCaptureConfig();
    }
    return rgbCaptureConfig[modal];
}

function getResponseMessage(res, fallbackMessage) {
    return res?.message || res?.data?.message || fallbackMessage;
}

function isRequestSuccess(res) {
    const status = res?.status ?? res?.data?.status ?? res?.success;
    if (typeof status === 'boolean') {
        return status;
    }
    if (typeof status === 'string') {
        return ['success', 'ok', 'true'].includes(status.toLowerCase());
    }
    return true;
}

function isToggleRequestSuccess(res, targetState) {
    const code = res?.code ?? res?.data?.code;
    if (typeof code === 'number' && code !== 200) {
        return false;
    }

    const status = res?.status ?? res?.success;
    if (typeof status === 'boolean') {
        return status;
    }
    if (typeof status === 'string') {
        return ['success', 'ok', 'true'].includes(status.toLowerCase());
    }

    const dataStatus = res?.data?.status;
    if (typeof dataStatus === 'boolean') {
        return dataStatus === targetState;
    }
    if (typeof dataStatus === 'string') {
        return ['success', 'ok', 'true'].includes(dataStatus.toLowerCase());
    }

    return isRequestSuccess(res);
}

function getRecentSnapshotTime(modal, listType) {
    return processStore.getListPagination(modal, listType)?.snapshotTime ?? null;
}

function validateRgbCaptureConfig(modal = RGB_MODAL, isRestart = false) {
    const config = getRgbCaptureConfig(modal);
    const interval = Number(config.interval);
    const count = Number(config.count);
    const minValue = 3;

    if (!Number.isFinite(interval) || interval < minValue || interval > 10) {
        ElMessage({
            message: 'RGB interval must be between 3 and 10 seconds.',
            type: 'warning'
        });
        return false;
    }

    if (config.captureMode === RGB_CAPTURE_MODE.COUNT && (!Number.isFinite(count) || count < minValue)) {
        ElMessage({
            message: isRestart ? 'RGB count must be greater than 3 when restarting.' : 'RGB count must be greater than 0 when starting.',
            type: 'warning'
        });
        return false;
    }

    return true;
}

// 关键修改：RGB 启动和运行中调参统一走专用 timelapse 接口。
function requestRgbCapture(modal = RGB_MODAL, isRestart = false) {
    const config = getRgbCaptureConfig(modal);
    const interval = Number(config.interval);
    const count = Number(config.count);
    const mac = config.mac || undefined;

    if (!validateRgbCaptureConfig(modal, isRestart)) {
        return Promise.reject(new Error('RGB capture config invalid'));
    }

    if (config.captureMode === RGB_CAPTURE_MODE.FOREVER) {
        return isRestart
            ? restartRgbTimelapseForever(interval, mac)
            : startRgbTimelapseForever(interval, mac);
    }

    return isRestart
        ? restartRgbTimelapse(interval, count, mac)
        : startRgbTimelapse(interval, count, mac);
}

function startCapturePolling(modal) {
    if (captureIntervalIds[modal]) {
        clearInterval(captureIntervalIds[modal]);
    }

    captureIntervalIds[modal] = setInterval(async () => {
        try {
            const response = await getRecentData(modal, 'collect', 1, getRecentSnapshotTime(modal, 'collect'));
            processStore.appendRecentPageData(modal, 'collect', response?.data);
            console.log(`获取最新数据(${modal}):`, response);
        } catch (error) {
            console.error(`获取数据失败 (${modal}):`, error);
        }
    }, 2000);
}

function stopCapturePolling(modal) {
    if (captureIntervalIds[modal]) {
        clearInterval(captureIntervalIds[modal]);
        delete captureIntervalIds[modal];
        console.log(`定时器已关闭 (${modal})`);
    }
}

function startProcessPolling(modal) {
    if (processIntervalIds[modal]) {
        clearInterval(processIntervalIds[modal]);
    }

    processIntervalIds[modal] = setInterval(async () => {
        try {
            const response = await getRecentData(modal, 'process', 1, getRecentSnapshotTime(modal, 'process'));
            processStore.appendRecentPageData(modal, 'process', response?.data);
            console.log(`获取最新结果 (${modal}):`, response);
        } catch (error) {
            console.error(`获取结果数据失败 (${modal}):`, error);
        }
    }, 2000);
}

function stopProcessPolling(modal) {
    if (processIntervalIds[modal]) {
        clearInterval(processIntervalIds[modal]);
        delete processIntervalIds[modal];
        console.log(`定时器已关闭 (${modal})`);
    }
}

function restartRgbCapture(modal = RGB_MODAL) {
    if (modal !== RGB_MODAL || !isCollecting[modal]) {
        return;
    }

    requestRgbCapture(modal, true).then(res => {
        if (!isRequestSuccess(res)) {
            ElMessage({
                message: getResponseMessage(res, 'RGB采集参数调整失败'),
                type: 'error'
            });
            return;
        }
        ElMessage({
            message: getResponseMessage(res, 'RGB采集参数已更新'),
            type: 'success'
        });
        processStore.setFlyToFlag(true);
        startCapturePolling(modal);
    }).catch(err => {
        ElMessage({
            message: err.message || 'RGB采集参数调整失败',
            type: 'error'
        });
    });
}

function updateRgbCaptureConfig(modal, patch = {}, options = {}) {
    if (modal !== RGB_MODAL) {
        return;
    }

    Object.assign(getRgbCaptureConfig(modal), patch);

    if (options.applyIfCollecting) {
        restartRgbCapture(modal);
    }
}

function normalizeRealtimeUavPayload(payload = {}) {
    const uavData = payload?.data || {};
    return {
        id: payload?.id ?? null,
        data: {
            lon: Number(uavData?.lon),
            lat: Number(uavData?.lat),
            alt: Number(uavData?.alt ?? 0),
            velo: Number(uavData?.velo ?? 0),
            yaw: Number(uavData?.yaw ?? 0),
            roll: Number(uavData?.roll ?? 0),
            pitch: Number(uavData?.pitch ?? -90),
            timestamp: uavData?.timestamp ?? '',
        }
    };
}

async function emitRealtimeUavFrame(modal = RGB_MODAL) {
    const response = await getRealtimeUavInfo();
    console.log('获取无人机实时信息:', response);
    const normalizedPayload = normalizeRealtimeUavPayload(response?.data || response);
    const data = normalizedPayload.data;
    if (Number.isNaN(data.lon) || Number.isNaN(data.lat)) {
        throw new Error('无人机实时信息缺少经纬度');
    }
    emit('realtime-uav-update', normalizedPayload);
}

function stopRealtimeUavVisibility(modal = RGB_MODAL) {
    if (realtimeUavPollingIds[modal]) {
        clearInterval(realtimeUavPollingIds[modal]);
        delete realtimeUavPollingIds[modal];
    }
    if (isRealtimeUavVisible[modal]) {
        isRealtimeUavVisible[modal] = false;
    }
    emit('realtime-uav-visibility-change', false);
}

function startRealtimeUavVisibility(modal = RGB_MODAL) {
    if (modal !== RGB_MODAL) {
        return;
    }

    stopRealtimeUavVisibility(modal);
    isRealtimeUavVisible[modal] = true;
    emit('realtime-uav-visibility-change', true);

    emitRealtimeUavFrame(modal).catch((error) => {
        stopRealtimeUavVisibility(modal);
        ElMessage({
            message: error.message || '无人机实时信息获取失败',
            type: 'error'
        });
    });

    realtimeUavPollingIds[modal] = setInterval(async () => {
        try {
            await emitRealtimeUavFrame(modal);
        } catch (error) {
            stopRealtimeUavVisibility(modal);
            ElMessage({
                message: error.message || '无人机实时信息获取失败',
                type: 'error'
            });
        }
    }, 8000);
}

function handleRealtimeUavVisibility(modal, nextState) {
    if (modal !== RGB_MODAL) {
        return;
    }

    if (nextState) {
        startRealtimeUavVisibility(modal);
        return;
    }

    stopRealtimeUavVisibility(modal);
}

// 关键修改：bench 内切换模态时，所有展示与控制都跟随当前模态联动。
function handleModalChange(modal) {
    if (!modalConfigs[modal]) {
        return;
    }
    if (currentModalType.value === RGB_MODAL && modal !== RGB_MODAL) {
        stopRealtimeUavVisibility(RGB_MODAL);
    }
    currentModalType.value = modal;
}

function normalizeItemId(id) {
    return id == null ? '' : String(id);
}

function getDeleteKey(item) {
    return normalizeItemId(item?.name || item?.fileName || item?.id);
}

function normalizeIdList(ids = []) {
    return ids.map((id) => normalizeItemId(id)).filter(Boolean);
}

function getSelectionList(modal, task) {
    return selectionState[modal]?.[task] || [];
}

function replaceSelection(modal, task, ids = []) {
    const target = getSelectionList(modal, task);
    target.splice(0, target.length, ...normalizeIdList(ids));
}

function clearSelection(modal, task) {
    replaceSelection(modal, task, []);
}

function resetTaskListState(modal, task) {
    // Key change: starting a new collect/process round must also reset local page, selection and delete state.
    processStore.resetListPagination(modal, task);
    paginationState[modal][task] = 1;
    clearSelection(modal, task);
    deletingState[modal][task] = false;
}

async function clearTaskDataAfterStart(modal, task) {
    // Key change: clear persisted task data before starting the next polling round so old and new sessions never mix.
    const res = await clearDataItems(modal, task);
    if (!isRequestSuccess(res)) {
        throw new Error(getResponseMessage(res, `${getTaskLabel(task)}閲嶇疆澶辫触`));
    }
    resetTaskListState(modal, task);
}

function removeSelectionIds(modal, task, ids = []) {
    const removeSet = new Set(normalizeIdList(ids));
    const nextSelection = getSelectionList(modal, task).filter((id) => !removeSet.has(normalizeItemId(id)));
    replaceSelection(modal, task, nextSelection);
}

function updateSelection(modal, task, id, checked) {
    const normalizedId = normalizeItemId(id);
    if (!normalizedId || isDeleteBlocked(modal, task)) {
        return;
    }

    const nextSelection = new Set(getSelectionList(modal, task).map((itemId) => normalizeItemId(itemId)));
    if (checked) {
        nextSelection.add(normalizedId);
    } else {
        nextSelection.delete(normalizedId);
    }
    replaceSelection(modal, task, Array.from(nextSelection));
}

function updateSelectionForPage(modal, task, ids = [], checked) {
    if (isDeleteBlocked(modal, task)) {
        return;
    }

    const pageIds = normalizeIdList(ids);
    const nextSelection = new Set(getSelectionList(modal, task).map((itemId) => normalizeItemId(itemId)));
    pageIds.forEach((id) => {
        if (checked) {
            nextSelection.add(id);
        } else {
            nextSelection.delete(id);
        }
    });
    replaceSelection(modal, task, Array.from(nextSelection));
}

function getTaskLabel(task) {
    const labelMap = {
        collect: '采集数据',
        process: '解译结果',
        history: '历史数据',
    };
    return labelMap[task] || '数据';
}

function getDeleteDisabledReason(modal, task) {
    if (task === 'collect' && isCollecting[modal]) {
        return '采集运行中不可删除';
    }
    if (task === 'process' && isInterpretate[modal]) {
        return '解译运行中不可删除';
    }
    return '';
}

function isDeleteBlocked(modal, task) {
    return Boolean(getDeleteDisabledReason(modal, task) || deletingState[modal]?.[task]);
}

function normalizePage(modal, listType, total) {
    const pageSize = listPageSizeMap[listType];
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(paginationState[modal][listType], 1), totalPages);
    paginationState[modal][listType] = currentPage;
    return currentPage;
}

function buildPagination(modal, listType) {
    if (listType === 'history') {
        return processStore.getHistoryPagination(modal);
    }

    const list = processStore.getList(modal, listType);
    const total = list.length;
    const pageSize = listPageSizeMap[listType];
    const page = normalizePage(modal, listType, total);
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

    return {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        snapshotTime: null,
    };
}

function buildPagedList(modal, listType) {
    if (listType === 'history') {
        return processStore.getList(modal, 'history');
    }

    const list = processStore.getList(modal, listType);
    const pageSize = listPageSizeMap[listType];
    const page = normalizePage(modal, listType, list.length);
    const start = (page - 1) * pageSize;

    return list.slice(start, start + pageSize);
}

function handleRecentPageChange(modal, listType, page) {
    paginationState[modal][listType] = page;
}

function handleHistoryPageChange(modal, page) {
    paginationState[modal].history = page;
    getModalHistoryList(modal, page);
}

const currentModalConfig = computed(() => modalConfigs[currentModalType.value]);
const currentCollectList = computed(() => buildPagedList(currentModalType.value, 'collect'));
const currentProcessList = computed(() => buildPagedList(currentModalType.value, 'process'));
const currentHistoryList = computed(() => buildPagedList(currentModalType.value, 'history'));
const currentCollectPagination = computed(() => buildPagination(currentModalType.value, 'collect'));
const currentProcessPagination = computed(() => buildPagination(currentModalType.value, 'process'));
const currentHistoryPagination = computed(() => buildPagination(currentModalType.value, 'history'));
const currentCollectSelectedIds = computed(() => getSelectionList(currentModalType.value, 'collect'));
const currentProcessSelectedIds = computed(() => getSelectionList(currentModalType.value, 'process'));
const currentHistorySelectedIds = computed(() => getSelectionList(currentModalType.value, 'history'));
const currentCollectDeleteDisabled = computed(() => Boolean(getDeleteDisabledReason(currentModalType.value, 'collect')));
const currentProcessDeleteDisabled = computed(() => Boolean(getDeleteDisabledReason(currentModalType.value, 'process')));
const currentHistoryDeleteDisabled = computed(() => Boolean(getDeleteDisabledReason(currentModalType.value, 'history')));
const currentCollectDeleteDisabledReason = computed(() => getDeleteDisabledReason(currentModalType.value, 'collect'));
const currentProcessDeleteDisabledReason = computed(() => getDeleteDisabledReason(currentModalType.value, 'process'));
const currentHistoryDeleteDisabledReason = computed(() => getDeleteDisabledReason(currentModalType.value, 'history'));
const currentCollectDeleting = computed(() => deletingState[currentModalType.value]?.collect || false);
const currentProcessDeleting = computed(() => deletingState[currentModalType.value]?.process || false);
const currentHistoryDeleting = computed(() => deletingState[currentModalType.value]?.history || false);
const currentRgbCaptureConfig = computed(() => getRgbCaptureConfig(currentModalType.value));
const currentWorkbenchRunning = computed(() => isCollecting[currentModalType.value] || isInterpretate[currentModalType.value]);
const currentWorkbenchStatus = computed(() => {
    const collecting = isCollecting[currentModalType.value];
    const interpretating = isInterpretate[currentModalType.value];

    if (collecting && interpretating) {
        return '采集与解译中';
    }
    if (collecting) {
        return '采集中';
    }
    if (interpretating) {
        return '解译中';
    }

    return '待命';
});

// function getData(modal){
//     setInterval(async () => {
//                 try {
//                     const response = await getRecentData(task = modal);
//                     processStore.addItemsToList(modal, 'collect', response.data); // 修改为按模态存储数据
//                     // 创建Graphic
//                     console.log(`获取最新数据 (${modal}):`, response);
//                 } catch (error) {
//                     console.error(`获取数据失败 (${modal}):`, error);
//                 }
//         }, 2000);
// }

/**
 * @description: 获取不同模态的采集数据
 * @param {*} modal
 * @return {*}
 * 
 */
function getCaptureData(modal, targetState = isCollecting[modal]) {
    const isCol = targetState;
    console.log("modal:", modal);
    const camSpeed = cameraSpeed[modal];
    // 检查是否开启采集

    if (isCol) {
        processStore.watchList(modal, 'collect', (newVal) => {
            console.log(`采集数据 (${modal}):`, newVal);
        });
        // ElMessage({
        //     message: `${modal}采集开启中`,
        //     type: 'info'
        // });
        cameraControl(modal, isCol, camSpeed).then(res => {
            if (!res.data.status){
                ElMessage({
                    message: res.data.message || "相机开启失败",
                    type: 'error'
                });
                return;
            }
            isCollecting[modal] = true;
            ElMessage({
                message: `${modal}相机开启成功`,
                type: 'success'
            });
            processStore.setFlyToFlag(true)
            // 启动定时器并保存定时器 ID
            if (captureIntervalIds[modal]) {
                clearInterval(captureIntervalIds[modal]);
            }
            captureIntervalIds[modal] = setInterval(async () => {
                try {
                    const response = await getRecentData(modal, 'collect', 1, getRecentSnapshotTime(modal, 'collect'));
                    processStore.appendRecentPageData(modal, 'collect', response?.data); // 关键修改：轮询接口返回 PageResponse，真正的列表数据在 fileList。
                    // 创建Graphic
                    console.log(`获取最新数据 (${modal}):`, response);
                } catch (error) {
                    console.error(`获取数据失败 (${modal}):`, error);
                }
            }, 2000);
        }).catch(err => {
            ElMessage({
                message: err.message || "相机开启失败",
                type: 'error'
            });
        });
    }
    // 关闭采集
    else {
        // ElMessage({
        //     message: `${modal}采集关闭中`,
        //     type: 'info'
        // });
        cameraControl(modal, isCol).then(res => {
            isCollecting[modal] = false;
            ElMessage({
                message: "相机关闭成功",
                type: 'success'
            });
            // 关闭对应模态的定时器
            if (captureIntervalIds[modal]) {
                clearInterval(captureIntervalIds[modal]);
                delete captureIntervalIds[modal]; // 删除定时器 ID
                console.log(`定时器已关闭 (${modal})`);
            }
        }).catch(err => {
            isCollecting[modal] = true;
            ElMessage({
                message: err.message || "相机关闭失败",
                type: 'error'
            });
        });
    }
}

function handleCaptureControl(modal, targetState = isCollecting[modal]) {
    const isCol = targetState;
    console.log("modal:", modal);
    const camSpeed = cameraSpeed[modal];

    if (isCol) {
        processStore.watchList(modal, 'collect', (newVal) => {
            console.log(`采集数据 (${modal}):`, newVal);
        });

        clearSelection(modal, 'collect');

        const startCaptureRequest = modal === RGB_MODAL
            ? requestRgbCapture(modal, false)
            : cameraControl(modal, isCol, camSpeed);

        startCaptureRequest.then(res => {
            if (!isToggleRequestSuccess(res, isCol)) {
                ElMessage({
                    message: getResponseMessage(res, '相机开启失败'),
                    type: 'error'
                });
                return;
            }

            isCollecting[modal] = true;
            ElMessage({
                message: getResponseMessage(res, `${modal}相机开启成功`),
                type: 'success'
            });
            processStore.setFlyToFlag(true);
            clearTaskDataAfterStart(modal, 'collect').then(() => {
                startCapturePolling(modal);
            }).catch(err => {
                ElMessage({
                    message: err.message || '閲囬泦鏁版嵁閲嶇疆澶辫触',
                    type: 'error'
                });
            });
        }).catch(err => {
            ElMessage({
                message: err.message || '相机开启失败',
                type: 'error'
            });
        });
        return;
    }

    // 关键修改：RGB 停止继续走专用 stop 接口，其它模态保持原有通用控制接口。
    const stopCaptureRequest = modal === RGB_MODAL
        ? stopRgbCamera(getRgbCaptureConfig(modal).mac || undefined)
        : cameraControl(modal, isCol);

    stopCaptureRequest.then(res => {
        if (modal === RGB_MODAL && !isToggleRequestSuccess(res, isCol)) {
            ElMessage({
                message: getResponseMessage(res, '相机关闭失败'),
                type: 'error'
            });
            return;
        }

        isCollecting[modal] = false;
        ElMessage({
            message: getResponseMessage(res, '相机关闭成功'),
            type: 'success'
        });
        stopCapturePolling(modal);
    }).catch(err => {
        isCollecting[modal] = true;
        ElMessage({
            message: err.message || '相机关闭失败',
            type: 'error'
        });
    });
}

/**
 * @description: 获取不同模态的处理结果
 * @param {*} modal
 * @return {*}
 */
function getProcessData(modal, targetState = isInterpretate[modal]) {
    const isInter = targetState;

    if (isInter) {
        processStore.watchList(modal, 'process', (newVal) => {
            console.log(`解译数据 (${modal}):`, newVal);
        });
        ElMessage({
            message: `${modal}解译开启中`,
            type: 'info'
        });
        clearSelection(modal, 'process');
        selectMethod(modal, isInter).then(res => {
            if (!isToggleRequestSuccess(res, isInter)) {
                ElMessage({
                    message: getResponseMessage(res, '解译开启失败'),
                    type: 'error'
                });
                return;
            }

            isInterpretate[modal] = true;
            ElMessage({
                message: getResponseMessage(res, `${modal}解译开启成功`),
                type: 'success'
            });
            // 关键修改：开启解译前先清空旧数据，再启动轮询，避免不同批次结果混在一起。
            clearTaskDataAfterStart(modal, 'process').then(() => {
                startProcessPolling(modal);
            }).catch(err => {
                ElMessage({
                    message: err.message || '解译数据重置失败',
                    type: 'error'
                });
            });
        }).catch(err => {
            ElMessage({
                message: err.message || '解译开启失败',
                type: 'error'
            });
        });
    } else {
        ElMessage({
            message: `${modal}解译关闭中`,
            type: 'info'
        });
        selectMethod(modal, isInter).then(res => {
            if (!isToggleRequestSuccess(res, isInter)) {
                ElMessage({
                    message: getResponseMessage(res, '解译关闭失败'),
                    type: 'error'
                });
                return;
            }

            isInterpretate[modal] = false;
            stopProcessPolling(modal);
            ElMessage({
                message: getResponseMessage(res, '解译关闭成功'),
                type: 'success'
            });
        }).catch(err => {
            isInterpretate[modal] = true;
            ElMessage({
                message: err.message || '解译关闭失败',
                type: 'error'
            });
        });
    }
}

function openControlConfirmDialog(modal, nextState) {
    controlConfirmDialog.visible = true;
    controlConfirmDialog.modal = modal;
    controlConfirmDialog.type = 'capture';
    controlConfirmDialog.nextState = nextState;
    controlConfirmDialog.message = nextState ? '是否确认开始采集？' : '是否确认关闭采集？';
}

function openProcessConfirmDialog(modal, nextState) {
    controlConfirmDialog.visible = true;
    controlConfirmDialog.modal = modal;
    controlConfirmDialog.type = 'process';
    controlConfirmDialog.nextState = nextState;
    controlConfirmDialog.message = nextState ? '是否确认开始解译？' : '是否确认关闭解译？';
}

function closeControlConfirmDialog() {
    controlConfirmDialog.visible = false;
}

function confirmControlAction() {
    const { modal, type, nextState } = controlConfirmDialog;
    closeControlConfirmDialog();

    if (type === 'capture') {
        handleCaptureControl(modal, nextState);
        return;
    }

    getProcessData(modal, nextState);
}

/**
 * @description: 获取历史数据列表
 * @param {*} modal
 * @return {*}
 */
function getDeleteResult(res, requestedKeys = []) {
    const failedKeys = normalizeIdList(
        res?.data?.failedFileNames || res?.data?.failedNames || res?.data?.failedIds || []
    );
    const deletedKeys = normalizeIdList(
        res?.data?.deletedFileNames || res?.data?.deletedNames || res?.data?.deletedIds || []
    );

    if (deletedKeys.length) {
        return { deletedKeys, failedKeys };
    }

    if (failedKeys.length) {
        const failedKeySet = new Set(failedKeys);
        return {
            deletedKeys: normalizeIdList(requestedKeys).filter((key) => !failedKeySet.has(key)),
            failedKeys,
        };
    }

    return {
        deletedKeys: normalizeIdList(requestedKeys),
        failedKeys: [],
    };
}

async function refreshHistoryAfterDelete(modal) {
    const currentPage = paginationState[modal].history || 1;
    const pageData = await getModalHistoryList(modal, currentPage);
    const fileList = Array.isArray(pageData?.fileList) ? pageData.fileList : [];

    if (!fileList.length && currentPage > 1) {
        return getModalHistoryList(modal, currentPage - 1);
    }

    return pageData;
}

async function executeDelete(modal, task, keys = []) {
    const normalizedKeys = normalizeIdList(keys);
    const taskLabel = getTaskLabel(task);
    const blockedReason = getDeleteDisabledReason(modal, task);

    if (!normalizedKeys.length) {
        ElMessage({
            message: `请先选择要删除的${taskLabel}`,
            type: 'warning'
        });
        return;
    }

    if (blockedReason) {
        ElMessage({
            message: blockedReason,
            type: 'warning'
        });
        return;
    }

    if (deletingState[modal][task]) {
        return;
    }

    let confirmMessage = normalizedKeys.length === 1 /*
        ? `确认删除该${taskLabel}吗？`
        : `确认删除选中的 ${normalizedIds.length} 条${taskLabel}吗？`;

    */;
    confirmMessage = normalizedKeys.length === 1
        ? `Confirm deleting this ${taskLabel}?`
        : `Confirm deleting ${normalizedKeys.length} selected ${taskLabel} item(s)?`;

    try {
        await ElMessageBox.confirm(confirmMessage, '删除确认', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'bigscreen-delete-confirm',
        });
    } catch (error) {
        return;
    }

    deletingState[modal][task] = true;

    try {
        const res = await deleteDataItems(modal, task, normalizedKeys);
        const { deletedKeys, failedKeys } = getDeleteResult(res, normalizedKeys);

        if (deletedKeys.length) {
            processStore.removeItemsFromList(modal, task, deletedKeys);
            removeSelectionIds(modal, task, deletedKeys);

            if (task === 'history') {
                await refreshHistoryAfterDelete(modal);
            }
        }

        if (failedKeys.length) {
            ElMessage({
                message: (deletedKeys.length
                    ? `Deleted ${deletedKeys.length} ${taskLabel} item(s); ${failedKeys.length} failed.`
                    : `${taskLabel} deletion failed`) /*
                    ? `已删除 ${deletedIds.length} 条${taskLabel}，${failedIds.length} 条删除失败`
                    : `${taskLabel}删除失败`,
                */,
                type: deletedKeys.length ? 'warning' : 'error'
            });
            return;
        }

        ElMessage({
            message: res.message || `${taskLabel}删除成功`,
            type: 'success'
        });
    } catch (err) {
        ElMessage({
            message: err.message || `${taskLabel}删除失败`,
            type: 'error'
        });
    } finally {
        deletingState[modal][task] = false;
    }
}

function handleDeleteItem(modal, task, key) {
    executeDelete(modal, task, [key]);
}

function handleBatchDelete(modal, task) {
    executeDelete(modal, task, getSelectionList(modal, task));
}

function getModalHistoryList(modal, page = 1) {
    return getHistoryList(modal, page).then(res => {
        console.log(`获取${modal}历史数据:`, res);
        const pageData = res.data || {};
        paginationState[modal].history = pageData.page || page;
        processStore.setHistoryPageData(modal, pageData);
        return pageData;
    }).catch(err => {
        console.error(`获取${modal}历史数据失败:`, err);
    });
}

/**
 * @description: 获取全部模态的历史数据
 * @return {*}
 */
onMounted(() => {
    modalities.forEach(modal => {
        processStore.watchList(modal, 'history', (newVal) => {
            console.log(`${modal}历史数据:`, newVal);
        });
        getModalHistoryList(modal, 1);
    });
});

onBeforeUnmount(() => {
    stopRealtimeUavVisibility(RGB_MODAL);
});

/**
 * @description: 数据转移
 * @param {*} modal
 * @param {*} task
 * @return {*}
 */
function dataTransfer(modal = 'rgb', task = 'collect') {
    // 这里可以添加数据转移的逻辑
    // ElMessage({
    //     message: "数据转移功能待实现",
    //     type: 'info'
    // });
    transferData(modal, task).then(res => {
        console.log(`数据转移 (${modal}, ${task}):`, res);
        ElMessage({
            message: res.message || "数据转移成功",
            type: 'success'
        });
        // processStore.addItemsToList(modal, 'history', processStore.getList(modal, task));

        getModalHistoryList(modal, 1); // 刷新历史数据列表并回到第一页
        processStore.clearList(modal, task); // 清空采集列表
    }).catch(err => {
        console.error(`数据转移失败 (${modal}, ${task}):`, err);
        ElMessage({
            message: err.message || "数据转移失败",
            type: 'error'
        });
    });

}


// ------------------------------------------------------------
// 案例演示相关代码，不具备交互功能


let isdisabledBtn = reactive({
    cp: false,
    tr: false,
    cps: true,
    trs: true,
})
let btnMessage = ref('进行旋转')
let props = defineProps(['bindMourseClick', 'processCtrlData', 'changeRotate', 'graphicQueue', 'updateProcess', 'updateTrans', 'updateEvaluate', 'showgraphic', 'toggleIsVisible', 'areaLabel', 'getProcessResult'])
const emit = defineEmits(['update:graphicQueue', 'workbench-visible-change', 'realtime-uav-update', 'realtime-uav-visibility-change'])
const { graphicQueue } = toRefs(props)
// 关键修改：小面板直接绑定父级贴图队列，保证新增、清空和显隐都作用到真实地图图层。
const processGraphicQueue = computed(() => Array.isArray(graphicQueue.value) ? graphicQueue.value : [])
let uploadProgress = ref(0)
let filePath = ref('D:/')
let selectedFile = ref(null)
let process2Model = ref(0)
let fileList = ref([])
let timeChange = ref(true)
function beforeUpload(file, fileList) {

    selectedFile.value = file
    console.log(`文件名称：${file}`);
}

function rmaClose() {
    dialogVisible.value.rma = false
    // console.log('rmaClose');
    process2Model.value = 0
}

function changePath() {
    // console.log(filePath.value);
    changePath(filePath.value).then(res => {
        console.log(res);
        ElMessage({
            message: res.message,
            type: 'success'
        })
    }).catch(err => {
        console.log(err);
    });
}

function changeMessage() {
    if (btnMessage.value == '进行旋转') {
        btnMessage.value = '停止旋转'
    } else {
        btnMessage.value = '进行旋转'
    }
    props.changeRotate()
}
let dialogVisible = ref({
    cp: false,
    tr: false,
    cps: false,
    trs: false,
    rma: false
});
function openDialog(type, num = 0) {
    console.log(`${type}Ready`);
    dialogVisible.value[type] = true;
    if (num != 0) {
        process2Model.value = num
    }
}

function closeDialog(type) {
    dialogVisible.value[type] = false;
}

function startControlApi(ctrlInst, isOpen) {
    let fileName = ''
    if (props.areaLabel === '洞庭湖') {
        fileName = 'dongtinghu';
    } else if (props.areaLabel === '资兴州司门') {
        fileName = 'zixing';
    } else if (props.areaLabel === '甘肃地震'){
        fileName = 'gansu';
    }else {
        fileName = 'congjiang';
    }
    if (!timeChange.value) {
        return
    }
    startControl(ctrlInst, isOpen, fileName, false).then(res => {
        // ElMessage({
        //     message: "操作成功",
        //     type: 'success'
        // })
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}

function confirmDialog(type) {
    dialogVisible.value[type] = false;
    console.log(`${type}Confirm`);

    if (type == 'cp') {
        props.updateProcess(true)
        // props.updateTrans(true)
        isdisabledBtn.cp = true
        isdisabledBtn.tr = true
        isdisabledBtn.cps = false
        isdisabledBtn.trs = false
        startControlApi('cp', true)
        props.toggleIsVisible(true)
    } else if (type == 'cps') {
        props.updateProcess(false)
        isdisabledBtn.cps = true
        isdisabledBtn.cp = false
        startControlApi('cp', false)
    }
}


const tableRowClassName = ({ row, rowIndex }) => {
    if (rowIndex % 2 == 0) {
        return "";
    } else {
        return "warning-row";
    }

};

function handleProgress(event, file, fileList) {
}

function handleSuccess(response, file, fileList) {
}

function handleError(err, file, fileList) {
    console.log("fileList", fileList);
    console.log("file", file);
    if (process2Model.value == 1) {
        ElMessage({
            message: '开始配准',
            type: 'success'
        })
        getProcess2Result(file.name, process2Model.value).then(res => {
            console.log(res);
            props.getProcessResult()

        }).catch(err => {
            console.log(err);
        });
    } else if (process2Model.value == 2) {
        ElMessage({
            message: '开始制图',
            type: 'success'
        })
        getProcess2Result(file.name, process2Model.value).then(res => {
            console.log(res);
            props.getProcessResult()

        }).catch(err => {
            console.log(err);
        });
    } else if (process2Model.value == 3) {
        ElMessage({
            message: '开始损毁评估',
            type: 'success'
        })
        getProcess2Result(file.name, process2Model.value).then(res => {
            console.log(res);

            props.getProcessResult()

        }).catch(err => {
            console.log(err);
        });
    }
}
let uploadRef = ref(null)
function submitUpload() {
    console.log(uploadRef.value.uploadFiles);
    uploadProgress.value = 0;
    let duration = 10000; // 10 seconds
    if (process2Model.value == 1) {
        duration = 5000;
    }
    else if (process2Model.value == 2) {
        duration = 20000;
    }
    else if (process2Model.value == 3) {
        duration = 15000;
    }
    const interval = 100; // Update every 100ms
    const increment = 100 / (duration / interval);
    const intervalId = setInterval(() => {
        if (uploadProgress.value < 100) {
            uploadProgress.value += increment;
        } else {
            uploadProgress.value = 100;
            clearInterval(intervalId);
        }
    }, interval);
    // 十秒钟让uploadProgress.value变成100%
    uploadRef.value.submit()
}

</script>

<style lang="scss" scoped>
:root {
    --el-drawer-bg-color: #04052C;
    /* 自定义背景颜色 */
}

/* // 表格斑马自定义颜色 */
::v-deep .el-table__row.warning-row {
    background: #01515a;
}


.processCtrlBlock {
    display: flex;
    justify-content: center;
    /* 将按钮水平居中对齐 */
    gap: 10px;
    /* 添加按钮之间的间距 */
    width: 100%;
    /* 父 div 的宽度 */
    height: 100%;
    /* 父 div 的高度 */
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(6, 19, 48, 0.62) 0%, rgba(10, 27, 62, 0.42) 100%);
    position: relative;
    overflow: hidden;
}

.processCtrlContent {
    width: 100%;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 56px 0 72px;
}

.processCtrlContent--expanded {
    padding: 8px 0 0;
}

.processWorkbenchWrapper {
    width: 100%;
    flex: 1;
    min-height: 0;
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
}

.button-container-above {
    position: absolute;
    /* 子级 div 设置为绝对定位 */
    top: 0;
    /* 将子级 div 定位到父级 div 的底部 */
    width: 100%;
    /* 根据需要设置宽度 */
    display: flex;
    justify-content: center;
    /* 按钮水平居中对齐 */
    gap: 10px;
    /* 按钮之间的间距 */

}

.dataTable {
    width: 100%;
    margin-top: -20px;
    margin-left: 10px;
    transform: translateY(-8px);
    cursor: pointer;
    /* 确保表格和下方按钮容器之间有足够的间距 */
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

.upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-row {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 10px;
}

.file-path-input {
    margin-left: 10px;
    margin-right: 10px;
    flex-grow: 1;
}

.upload-progress {
    width: 100%;
}

.progress-container {
    width: 100%;
    text-align: center;
    margin-top: 10px;
}

.page-btn {
    position: absolute;
    width: 150px;
    height: 150px;
    line-height: 85px;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #EAEDF2;
    background: url("@/assets/img/bigScreen/btn.png") no-repeat center;
    background-size: 100% 100%;
    // position: absolute;
    top: -32px;
    cursor: pointer;
    display: flex;
}

.page-btn.active,
.page-btn:hover {
    background: url("@/assets/img/bigScreen/btn-active.png") no-repeat center;
    background-size: 100% 100%;
    color: #FBFFC7;
}

.button-container-above-1 {
    position: relative;
    top: 0;
    width: 100%;
    height: 80%;
    // display: flex;
    // flex-direction: column;
    // justify-content: space-between;
    // /* 等间距填充排列 */
    // align-items: center;
    /* 可选：使按钮居中对齐 */
    gap: 10px;
    /* 按钮之间的间距 */
}

.btn_3 {
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
}

.btn_1 {
    bottom: 0;
    top: 17%;
    left: 25%;
    transform: translateX(-45%);
}

.btn_2 {
    bottom: 0;
    top: 17%;
    right: 25%;
    transform: translateX(45%);
}

::v-deep .el-drawer {
    background-color: #1C3C5A;
    /* 设置背景颜色 */
    backdrop-filter: blur(10px);
    /* 添加磨砂效果 */
    opacity: 0.9;
    /* 设置透明度 */
    z-index: 10;
}

::v-deep .el-drawer__title {
    width: 405px;
    // height: 40px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding-left: 40px;
    box-sizing: border-box;
    font-size: 20px;
    position: relative;
    color: #ffffff;
    /* 设置文字为白色 */
    font-weight: bold;
    /* 设置文字加粗 */

    .back {
        width: 405px;
        height: 32px;
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: -1;
    }

    .text {
        font-size: 20px;
        font-weight: 600;
        white-space: nowrap;
        text-align: left;
        transform: translateX(-20px);
        /* 向左移动 10 像素 */
        color: #ffffff;
        /* 设置文字为白色 */
        font-weight: bold;
        /* 设置文字加粗 */
    }

    .butList {
        display: flex;
    }
}

.body {
    height: calc(100% - 40px);
    display: flex;
    position: relative;
}

.dataModule {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 95%;
    width: 90%;
    margin: auto;
}

.module {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #2a2b55;
    padding: 10px;
    color: #ffffff;
}


.module svg.icon {
    margin-right: 10px;
    fill: #ffffff;
    /* SVG 图标颜色 */
}

.module span {
    font-size: 18px;
    /* 放大文字 */
    font-weight: bold;
    /* 加粗文字 */
    color: #ffffff;
}

.custom-control {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    /* 虚线边框 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 添加阴影 */
    margin: 10px;
    /* 内边距 */
}

.process-control {
    width: 100%;
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    /* 虚线边框 */
    border-radius: 10px;
    /* 圆角 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* 添加阴影 */
    margin: 10px;
    /* 内边距 */
}

.button-group {
    display: flex;
    gap: 15px;
    /* 按钮之间的间距 */
    margin-top: 10px;
    /* 按钮组与标题的间距 */
}

.button-group .el-button {
    padding: 12px 20px;
    /* 增大按钮尺寸 */
}

.slider-container {
    margin-top: 20px;
    /* 滑动条与按钮组的间距 */
    width: 90%;
    /* 滑动条宽度 */
    display: flex;
    flex-direction: column;
    align-items: center;
}

.slider-container span {
    margin-bottom: 10px;
    /* 滑动条标题与滑动条的间距 */
    font-size: 16px;
    font-weight: bold;
    color: #ffffff;
    /* 白色文字 */
}

.virtual-table {
    width: 100%;
    border-radius: 10px;
    /* 圆角 */
    padding: 20px;
    /* 内边距 */
}

::v-deep .custom-table {
    --el-table-border-color: none;
    border-left: 1px solid #143275;
    border-right: 1px solid #143275;
    border-bottom: 1px solid #143275;
}

/* 表头样式 */
::v-deep(.custom-table thead th) {
    background-color: #175D83 !important;
    color: #fff !important;
    font-size: 14px;
    text-align: center;
    border-left: 0.5px solid #154480 !important;
    border-bottom: 1px solid #154480 !important;
    // background: transparent !important;
}

/* 单元格样式，继承行颜色 */
::v-deep(.custom-table td) {
    color: inherit !important;
    font-size: 14px;
    text-align: center;
    border-left: 0.5px solid #143275;
    border-bottom: 0.5px solid #143275;
    background-color: transparent !important;
}

/* 奇数行：透明背景 + 黑色文字 + 加粗 */
::v-deep(.custom-table .even-row) {
    background-color: transparent !important;
    color: #fff !important;
    // font-weight: bold;
}

/* 偶数行：淡蓝色背景 + 白色文字 + 加粗 */
::v-deep(.custom-table .odd-row) {
    background-color: #2a6f95 !important;
    color: #fff !important;
    // font-weight: bold;
}

/* hover 时对奇偶行分别设置颜色 */
::v-deep(.custom-table .even-row:hover) {
    background-color: rgba(0, 0, 0, 0.05) !important;
    /* 偶尔淡灰 hover */
}

::v-deep(.custom-table .odd-row:hover) {
    background-color: #25627f !important;
    /* 偶数行 hover 深一点 */
}

/* 如果你使用 highlight-current-row=true，需要给当前行特殊颜色或保持原样 */
::v-deep(.custom-table .el-table__row.current-row) {
    background-color: #1e506d !important;
    /* 自定义选中行背景色 */
}

::v-deep(.custom-table .col-10) {
    width: 10% !important;
}

::v-deep(.custom-table .col-20) {
    width: 20% !important;
}

::v-deep(.custom-table .col-30) {
    width: 30% !important;
}

::v-deep(.custom-table .col-40) {
    width: 40% !important;
}

/* 默认状态：未激活文字灰色，激活文字默认色 */
::v-deep .el-switch__label.el-switch__label--left {
    color: #2a6f95;
}

::v-deep .el-switch__label.el-switch__label--right {
    color: #fff;
}

/* 激活状态 */
::v-deep .el-switch.is-checked .el-switch__label.el-switch__label--left {
    color: #fff;
}

::v-deep .el-switch.is-checked .el-switch__label.el-switch__label--right {
    color: #2a6f95;
}

::v-deep .el-switch.is-checked .el-switch__core {
    background-color: #1d4f6a;
    /* 按钮颜色 */
    border-color: #fff;
}

::v-deep .el-slider {
    --el-color-primary: #377a9e;
}

.switch-container {
    display: flex;
    align-items: center;
    /* 垂直居中 */
}
</style>

<style lang="scss">
.bigscreen-delete-confirm {
    border: 1px solid rgba(72, 156, 224, 0.36);
    border-radius: 18px;
    background:
        radial-gradient(circle at top right, rgba(69, 186, 255, 0.14), transparent 34%),
        linear-gradient(180deg, rgba(8, 18, 50, 0.98) 0%, rgba(18, 42, 83, 0.96) 100%);
    box-shadow: 0 20px 46px rgba(2, 9, 29, 0.38);
    overflow: hidden;
}

.bigscreen-delete-confirm .el-message-box__header {
    padding: 18px 22px 10px;
}

.bigscreen-delete-confirm .el-message-box__title {
    color: #f3f8ff;
    font-size: 18px;
    font-weight: 700;
}

.bigscreen-delete-confirm .el-message-box__headerbtn .el-message-box__close {
    color: rgba(214, 235, 255, 0.72);
}

.bigscreen-delete-confirm .el-message-box__headerbtn:hover .el-message-box__close {
    color: #ffffff;
}

.bigscreen-delete-confirm .el-message-box__content {
    padding: 10px 22px 22px;
}

.bigscreen-delete-confirm .el-message-box__container {
    align-items: flex-start;
    gap: 12px;
}

.bigscreen-delete-confirm .el-message-box__status {
    color: #66cfff !important;
    font-size: 22px !important;
}

.bigscreen-delete-confirm .el-message-box__message {
    color: #d7ecff;
    font-size: 14px;
    line-height: 1.75;
}

.bigscreen-delete-confirm .el-message-box__btns {
    padding: 0 22px 20px;
}

.bigscreen-delete-confirm .el-button {
    min-width: 92px;
    border-radius: 999px;
}

.bigscreen-delete-confirm .el-button--default {
    border-color: rgba(102, 185, 255, 0.28);
    background: rgba(23, 93, 131, 0.14);
    color: #d7ecff;
}

.bigscreen-delete-confirm .el-button--default:hover,
.bigscreen-delete-confirm .el-button--default:focus {
    border-color: rgba(129, 212, 255, 0.54);
    background: rgba(34, 128, 196, 0.22);
    color: #ffffff;
}

.bigscreen-delete-confirm .el-button--primary {
    border-color: rgba(102, 185, 255, 0.42);
    background: linear-gradient(135deg, rgba(34, 128, 196, 0.95), rgba(23, 93, 131, 0.95));
    box-shadow: inset 0 0 0 1px rgba(119, 201, 255, 0.18);
    color: #ffffff;
}

.bigscreen-delete-confirm .el-button--primary:hover,
.bigscreen-delete-confirm .el-button--primary:focus {
    border-color: rgba(129, 212, 255, 0.68);
    background: linear-gradient(135deg, rgba(47, 154, 227, 0.96), rgba(28, 108, 168, 0.96));
}
</style>

