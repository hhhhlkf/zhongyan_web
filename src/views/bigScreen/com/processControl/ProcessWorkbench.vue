<template>
    <div v-if="visible" class="process-workbench" :class="modalConfig.themeClass">
        <div class="process-workbench__scroll">
            <div class="process-workbench__header">
                <div>
                    <div class="process-workbench__eyebrow">Process Workbench</div>
                    <div class="process-workbench__title">{{ modalConfig.title }}</div>
                    <div class="process-workbench__subtitle">{{ modalConfig.statusText }}</div>
                </div>
                <div class="process-workbench__actions">
                    <div class="process-workbench__status" :class="{ running }">{{ workbenchStatus }}</div>
                    <el-button text class="process-workbench__close" @click="$emit('close')">{{ text.close }}</el-button>
                </div>
            </div>

            <div class="process-workbench__modal-switch">
                <button v-for="modal in modalOptions" :key="modal.key" type="button" class="process-modal-switch__item"
                    :class="{ active: modalType === modal.type }" @click="$emit('modal-change', modal.type)">
                    {{ getModalDisplayName(modal) }}
                </button>
            </div>

            <div class="process-workbench__controls">
                <div class="control-card">
                    <div class="control-card__title">{{ text.captureTitle }}</div>
                    <div class="control-card__hint">{{ text.captureHint }}</div>
                    <div class="control-card__main">
                        <el-button class="control-card__action-btn" :class="{ 'is-stop': isCollecting }"
                            @click="$emit('capture-toggle-request', modalType, !isCollecting)">
                            {{ isCollecting ? text.stopCapture : text.startCapture }}
                        </el-button>
                        <el-button type="primary" @click="$emit('transfer', modalType, 'collect')">{{ text.transferData }}</el-button>
                    </div>
                    <div class="control-card__slider">
                        <span>{{ text.speedControl }}</span>
                        <el-slider v-model="cameraSpeedModel" :min="modalConfig.speedMin" :max="modalConfig.speedMax" />
                    </div>
                </div>

                <div class="control-card">
                    <div class="control-card__title">{{ text.processTitle }}</div>
                    <div class="control-card__hint">{{ text.processHint }}</div>
                    <div class="control-card__main">
                        <el-button class="control-card__action-btn" :class="{ 'is-stop': isInterpretate }"
                            @click="$emit('process-toggle-request', modalType, !isInterpretate)">
                            {{ isInterpretate ? text.stopProcess : text.startProcess }}
                        </el-button>
                        <el-button type="primary" @click="$emit('transfer', modalType, 'process')">{{ text.transferResult }}</el-button>
                    </div>
                </div>
            </div>

            <div class="process-workbench__tabs">
                <button v-for="tab in tabs" :key="tab.key" type="button" class="process-tab"
                    :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
                    {{ tab.label }}
                </button>
            </div>

            <div class="process-workbench__panel">
                <CapturePanel v-if="activeTab === 'collect'" :list="collectList" :pagination="collectPagination"
                    :table-height="tableHeight" :row-class-name="rowClassName"
                    @page-change="(page) => $emit('recent-page-change', modalType, 'collect', page)" />

                <ProcessPanel v-else-if="activeTab === 'process'" :list="processList" :pagination="processPagination"
                    :table-height="tableHeight" :row-class-name="rowClassName"
                    @page-change="(page) => $emit('recent-page-change', modalType, 'process', page)" />

                <HistoryPanel v-else :list="historyList" :pagination="historyPagination" :table-height="tableHeight"
                    :row-class-name="rowClassName" @page-change="(page) => $emit('history-page-change', modalType, page)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import CapturePanel from './CapturePanel.vue';
import ProcessPanel from './ProcessPanel.vue';
import HistoryPanel from './HistoryPanel.vue';

const props = defineProps({
    visible: { type: Boolean, default: false },
    modalType: { type: String, required: true },
    modalOptions: { type: Array, default: () => [] },
    modalConfig: { type: Object, required: true },
    collectList: { type: Array, default: () => [] },
    processList: { type: Array, default: () => [] },
    historyList: { type: Array, default: () => [] },
    collectPagination: { type: Object, required: true },
    processPagination: { type: Object, required: true },
    historyPagination: { type: Object, required: true },
    isCollecting: { type: Boolean, default: false },
    isInterpretate: { type: Boolean, default: false },
    running: { type: Boolean, default: false },
    workbenchStatus: { type: String, default: '\u5f85\u547d' },
    cameraSpeed: { type: Number, default: 0 },
    tableHeight: { type: Number, required: true },
    rowClassName: { type: Function, required: true },
});

const emit = defineEmits([
    'close',
    'modal-change',
    'capture-toggle-request',
    'process-toggle-request',
    'transfer',
    'recent-page-change',
    'history-page-change',
    'update:cameraSpeed',
]);

const text = {
    close: '\u6536\u8d77',
    captureTitle: '\u91c7\u96c6\u63a7\u5236',
    captureHint: '\u63a7\u5236\u8fb9\u7f18\u4fa7\u5b9e\u65f6\u91c7\u96c6\uff0c\u5e76\u6309\u9700\u8f6c\u79fb\u91c7\u96c6\u6570\u636e\u3002',
    startCapture: '\u5f00\u59cb\u91c7\u96c6',
    stopCapture: '\u5173\u95ed\u91c7\u96c6',
    transferData: '\u6570\u636e\u8f6c\u79fb',
    speedControl: '\u901f\u5ea6\u63a7\u5236',
    processTitle: '\u89e3\u8bd1\u63a7\u5236',
    processHint: '\u63a7\u5236\u89e3\u8bd1\u4efb\u52a1\u6267\u884c\uff0c\u5e76\u5feb\u901f\u8f6c\u79fb\u6700\u65b0\u6210\u679c\u3002',
    startProcess: '\u5f00\u59cb\u89e3\u8bd1',
    stopProcess: '\u5173\u95ed\u89e3\u8bd1',
    transferResult: '\u7ed3\u679c\u8f6c\u79fb',
    collectTab: '\u91c7\u96c6\u6570\u636e',
    processTab: '\u89e3\u8bd1\u7ed3\u679c',
    historyTab: '\u5386\u53f2\u8bb0\u5f55',
    rgb: '\u53ef\u89c1\u5149',
    llt: '\u5fae\u5149\u7ea2\u5916',
    hsi: '\u9ad8\u5149\u8c31',
};

const tabs = [
    { key: 'collect', label: text.collectTab },
    { key: 'process', label: text.processTab },
    { key: 'history', label: text.historyTab },
];

const activeTab = ref('collect');

function getModalDisplayName(modal) {
    const modalNameMap = {
        rgb: text.rgb,
        llt: text.llt,
        hsi: text.hsi,
    };

    return modalNameMap[modal.type] || modal.label;
}

watch(
    () => props.modalType,
    () => {
        activeTab.value = 'collect';
    }
);

const cameraSpeedModel = computed({
    get: () => props.cameraSpeed,
    set: (value) => emit('update:cameraSpeed', value),
});
</script>

<style lang="scss" scoped>
.process-workbench {
    flex: 1;
    height: calc(100% + 20px);
    min-height: 0;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(21, 68, 128, 0.95);
    border-radius: 22px;
    background:
        radial-gradient(circle at top right, rgba(69, 186, 255, 0.16), transparent 28%),
        linear-gradient(180deg, rgba(8, 18, 50, 0.98) 0%, rgba(18, 42, 83, 0.96) 100%);
    box-shadow: 0 18px 40px rgba(2, 9, 29, 0.34);
    overflow: hidden;
}

.process-workbench__scroll {
    flex: 1;
    min-height: 0;
    padding: 22px 18px 22px 24px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.05);
}

.process-workbench__scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.process-workbench__scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 10px;
}

.process-workbench__scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

.process-workbench__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 20px;
}

.process-workbench__eyebrow {
    color: rgba(153, 204, 255, 0.72);
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.process-workbench__title {
    margin-top: 6px;
    color: #ffffff;
    font-size: 28px;
    font-weight: 700;
}

.process-workbench__subtitle {
    margin-top: 8px;
    color: rgba(214, 235, 255, 0.78);
    font-size: 14px;
    line-height: 1.6;
}

.process-workbench__actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.process-workbench__status {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(23, 93, 131, 0.24);
    color: #cfe8ff;
    font-size: 13px;
}

.process-workbench__status.running {
    background: rgba(23, 93, 131, 0.44);
    box-shadow: inset 0 0 0 1px rgba(23, 93, 131, 0.45);
    color: #ffffff;
}

.process-workbench__close {
    color: #cfe8ff;
    min-width: 104px;
    height: 38px;
    padding: 8px 20px;
    border-radius: 999px;
    background: rgba(23, 93, 131, 0.2);
    box-shadow: inset 0 0 0 1px rgba(102, 185, 255, 0.22);
}

.process-workbench__close:hover {
    color: #ffffff;
    background: rgba(51, 221, 255, 0.4);
    box-shadow: inset 0 0 0 1px rgba(114, 233, 255, 0.42);
}

.process-workbench__close:active {
    color: #ffffff;
    background: rgba(51, 221, 255, 0.52);
    box-shadow: inset 0 0 0 1px rgba(142, 239, 255, 0.52);
}

.process-workbench__controls {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
}

.process-workbench__modal-switch {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
    padding: 8px;
    border-radius: 999px;
    background: rgba(8, 25, 55, 0.72);
    box-shadow: inset 0 0 0 1px rgba(90, 176, 244, 0.14);
    width: fit-content;
    max-width: 100%;
    flex-wrap: wrap;
}

.process-modal-switch__item {
    min-width: 110px;
    padding: 10px 18px;
    border: 1px solid rgba(86, 165, 238, 0.32);
    border-radius: 999px;
    background: rgba(23, 93, 131, 0.12);
    color: #d9edff;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.process-modal-switch__item:hover,
.process-modal-switch__item.active {
    background: linear-gradient(135deg, rgba(39, 132, 198, 0.92), rgba(26, 94, 147, 0.94));
    border-color: rgba(118, 209, 255, 0.78);
    color: #ffffff;
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(16, 72, 116, 0.28);
}

.control-card {
    padding: 18px 20px;
    border: 1px solid rgba(89, 183, 255, 0.22);
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(13, 30, 64, 0.92) 0%, rgba(10, 25, 54, 0.88) 100%);
    box-shadow: inset 0 0 0 1px rgba(27, 103, 166, 0.16);
}

.control-card__title {
    margin-bottom: 6px;
    color: #f3f8ff;
    font-size: 17px;
    font-weight: 600;
}

.control-card__hint {
    color: rgba(207, 232, 255, 0.72);
    font-size: 13px;
    line-height: 1.5;
}

.control-card__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 14px;
    flex-wrap: wrap;
}

.control-card__action-btn {
    min-width: 118px;
    border: none;
    background: linear-gradient(135deg, rgba(34, 128, 196, 0.95), rgba(23, 93, 131, 0.95));
    box-shadow: inset 0 0 0 1px rgba(119, 201, 255, 0.24);
    color: #fff;
}

.control-card__action-btn.is-stop {
    background: linear-gradient(135deg, rgba(16, 96, 148, 0.98), rgba(9, 67, 112, 0.96));
}

.control-card__action-btn:hover {
    background: linear-gradient(135deg, rgba(51, 221, 255, 0.4), rgba(34, 150, 214, 0.9));
    color: #fff;
}

.control-card__slider {
    margin-top: 16px;
    color: #cfe8ff;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.process-workbench__tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
    flex-wrap: wrap;
}

.process-tab {
    padding: 10px 16px;
    border: 1px solid rgba(86, 165, 238, 0.48);
    border-radius: 999px;
    background: rgba(23, 93, 131, 0.14);
    color: #d9edff;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.process-tab.active,
.process-tab:hover {
    background: linear-gradient(135deg, rgba(39, 132, 198, 0.9), rgba(26, 94, 147, 0.92));
    border-color: rgba(118, 209, 255, 0.72);
    transform: translateY(-1px);
}

.process-workbench__panel {
    min-height: 0;
    padding: 16px 18px 18px;
    margin-top: -6px;
    margin-left: 10px;
    border-radius: 18px;
    background: rgba(5, 19, 47, 0.52);
    box-shadow: inset 0 0 0 1px rgba(61, 125, 184, 0.18);
}

.process-workbench__panel :deep(.history-pagination) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 12px;
    color: #cfe8ff;
}

.process-workbench__panel :deep(.history-pagination__total) {
    color: #cfe8ff;
    font-size: 13px;
}

.process-workbench__panel :deep(.history-pagination__pager button),
.process-workbench__panel :deep(.history-pagination__pager .btn-prev),
.process-workbench__panel :deep(.history-pagination__pager .btn-next),
.process-workbench__panel :deep(.history-pagination__pager .el-pager li) {
    min-width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 6px;
    border: 1px solid #154480 !important;
    background: rgba(21, 68, 128, 0.22) !important;
    color: #cfe8ff !important;
    transition: all 0.2s ease;
}

.process-workbench__panel :deep(.history-pagination__pager button:disabled),
.process-workbench__panel :deep(.history-pagination__pager .btn-prev:disabled),
.process-workbench__panel :deep(.history-pagination__pager .btn-next:disabled) {
    border-color: rgba(21, 68, 128, 0.45) !important;
    background: rgba(21, 68, 128, 0.12) !important;
    color: rgba(207, 232, 255, 0.42) !important;
}

.process-workbench__panel :deep(.history-pagination__pager button:hover),
.process-workbench__panel :deep(.history-pagination__pager .btn-prev:hover),
.process-workbench__panel :deep(.history-pagination__pager .btn-next:hover),
.process-workbench__panel :deep(.history-pagination__pager .el-pager li:hover) {
    border-color: #175D83 !important;
    background: rgba(23, 93, 131, 0.28) !important;
    color: #ffffff !important;
}

.process-workbench__panel :deep(.history-pagination__pager .el-pager li.is-active) {
    border-color: #175D83 !important;
    background: #175D83 !important;
    color: #ffffff !important;
    box-shadow: inset 0 0 0 1px rgba(134, 211, 246, 0.28);
}

@media (max-width: 1440px) {
    .process-workbench__scroll {
        padding: 18px 14px 18px 20px;
    }

    .process-workbench__header {
        flex-direction: column;
        align-items: stretch;
    }

    .process-workbench__actions {
        justify-content: space-between;
    }

    .control-card__main {
        align-items: flex-start;
        flex-direction: column;
    }
}

.theme-rgb {
    box-shadow: 0 16px 36px rgba(2, 9, 29, 0.3), inset 0 0 0 1px rgba(62, 151, 255, 0.08);
}

.theme-llt {
    box-shadow: 0 16px 36px rgba(2, 9, 29, 0.3), inset 0 0 0 1px rgba(66, 207, 188, 0.08);
}

.theme-hsi {
    box-shadow: 0 16px 36px rgba(2, 9, 29, 0.3), inset 0 0 0 1px rgba(255, 198, 92, 0.08);
}
</style>
