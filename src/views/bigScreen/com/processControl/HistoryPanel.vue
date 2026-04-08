<template>
    <div class="panel-section">
        <div class="module panel-section__title">
            <span>历史结果列表</span>
        </div>
        <div class="panel-section__toolbar">
            <div class="panel-section__toolbar-info">
                <el-checkbox class="panel-section__checkbox" :model-value="isCurrentPageAllSelected" :indeterminate="isCurrentPageIndeterminate"
                    :disabled="selectionDisabled || !currentPageIds.length"
                    @change="(checked) => $emit('toggle-select-all', currentPageIds, checked)">
                    本页全选
                </el-checkbox>
                <span class="panel-section__selected">已选 {{ selectedCount }} 条</span>
                <span v-if="deleteDisabledReason" class="panel-section__hint">{{ deleteDisabledReason }}</span>
            </div>
            <el-button class="panel-section__batch-btn" :disabled="selectionDisabled || !selectedCount" @click="$emit('batch-delete')">
                批量删除
            </el-button>
        </div>
        <div class="virtual-table">
            <el-table :data="list" style="width: 100%;" stripe border :row-class-name="rowClassName"
                class="custom-table" :height="tableHeight">
                <el-table-column label="选择" width="76">
                    <template #default="scope">
                        <el-checkbox class="panel-section__checkbox" :model-value="isRowSelected(scope.row)" :disabled="selectionDisabled"
                            @change="(checked) => $emit('toggle-select', normalizeDeleteKey(scope.row), checked)" />
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="序号" class-name="col-10"></el-table-column>
                <el-table-column prop="name" label="名称" class-name="col-40"></el-table-column>
                <el-table-column prop="time" label="时间" class-name="col-40"></el-table-column>
                <el-table-column label="显示" class-name="col-20">
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.graphic" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <el-button link class="panel-section__delete-btn" :disabled="selectionDisabled"
                            @click="$emit('delete-item', normalizeDeleteKey(scope.row))">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="history-pagination">
                <span class="history-pagination__total">共 {{ pagination.total }} 条</span>
                <el-pagination class="history-pagination__pager" layout="prev, pager, next" :pager-count="5"
                    :current-page="pagination.page" :page-size="pagination.pageSize" :total="pagination.total"
                    :hide-on-single-page="false" @current-change="(page) => $emit('page-change', page)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    list: { type: Array, default: () => [] },
    pagination: { type: Object, required: true },
    tableHeight: { type: Number, required: true },
    rowClassName: { type: Function, required: true },
    selectedIds: { type: Array, default: () => [] },
    deleteDisabled: { type: Boolean, default: false },
    deleteDisabledReason: { type: String, default: '' },
    deleting: { type: Boolean, default: false },
});

defineEmits(['page-change', 'toggle-select', 'toggle-select-all', 'batch-delete', 'delete-item']);

function normalizeId(id) {
    return id == null ? '' : String(id);
}

function normalizeDeleteKey(row) {
    return normalizeId(row?.name || row?.fileName || row?.id);
}

const selectedIdSet = computed(() => new Set(props.selectedIds.map((id) => normalizeId(id)).filter(Boolean)));
const currentPageIds = computed(() => props.list.map((item) => normalizeDeleteKey(item)).filter(Boolean));
const selectedCount = computed(() => selectedIdSet.value.size);
const selectionDisabled = computed(() => props.deleteDisabled || props.deleting);
const isCurrentPageAllSelected = computed(() => currentPageIds.value.length > 0
    && currentPageIds.value.every((id) => selectedIdSet.value.has(id)));
const isCurrentPageIndeterminate = computed(() => !isCurrentPageAllSelected.value
    && currentPageIds.value.some((id) => selectedIdSet.value.has(id)));

function isRowSelected(row) {
    return selectedIdSet.value.has(normalizeDeleteKey(row));
}
</script>

<style lang="scss" scoped>
.panel-section__title {
    margin-bottom: 10px;
}

.panel-section__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
    color: #fff;
}

.panel-section__toolbar-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.panel-section__selected {
    color: #cfe8ff;
    font-size: 13px;
}

.panel-section__hint {
    color: rgba(255, 206, 120, 0.88);
    font-size: 12px;
}

.panel-section__batch-btn {
    min-width: 108px;
    border: 1px solid rgba(102, 185, 255, 0.34);
    background: linear-gradient(135deg, rgba(20, 76, 122, 0.86), rgba(13, 54, 93, 0.88));
    box-shadow: inset 0 0 0 1px rgba(129, 212, 255, 0.12);
    color: #e8f6ff;
}

.panel-section__batch-btn:hover,
.panel-section__batch-btn:focus {
    border-color: rgba(129, 212, 255, 0.62);
    background: linear-gradient(135deg, rgba(31, 116, 176, 0.92), rgba(18, 83, 132, 0.94));
    color: #fff;
}

.panel-section__batch-btn.is-disabled,
.panel-section__batch-btn.is-disabled:hover {
    border-color: rgba(71, 108, 140, 0.42);
    background: rgba(14, 38, 68, 0.56);
    color: rgba(207, 232, 255, 0.42);
}

.panel-section__delete-btn {
    color: #7ed9ff;
    font-weight: 600;
}

.panel-section__delete-btn:hover,
.panel-section__delete-btn:focus {
    color: #b2edff;
}

.panel-section__delete-btn.is-disabled,
.panel-section__delete-btn.is-disabled:hover {
    color: rgba(207, 232, 255, 0.38);
}

:deep(.panel-section__checkbox .el-checkbox__label) {
    color: #d7ecff;
}

:deep(.panel-section__checkbox .el-checkbox__input .el-checkbox__inner) {
    border-color: rgba(116, 198, 255, 0.45);
    background: rgba(10, 31, 58, 0.9);
}

:deep(.panel-section__checkbox .el-checkbox__input.is-checked .el-checkbox__inner),
:deep(.panel-section__checkbox .el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    border-color: #66cfff;
    background: linear-gradient(135deg, #2c9fd8, #1a6fbb);
}

:deep(.panel-section__checkbox .el-checkbox__input.is-disabled .el-checkbox__inner) {
    border-color: rgba(71, 108, 140, 0.45);
    background: rgba(10, 31, 58, 0.38);
}

:deep(.panel-section__checkbox .el-checkbox__input.is-disabled + .el-checkbox__label) {
    color: rgba(207, 232, 255, 0.42);
}
</style>
