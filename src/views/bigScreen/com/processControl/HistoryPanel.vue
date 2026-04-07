<template>
    <div class="panel-section">
        <div class="module panel-section__title">
            <span>历史结果列表</span>
        </div>
        <div class="virtual-table">
            <el-table :data="list" style="width: 100%;" stripe border :row-class-name="rowClassName"
                class="custom-table" :height="tableHeight">
                <el-table-column prop="id" label="序号" class-name="col-10"></el-table-column>
                <el-table-column prop="name" label="名称" class-name="col-40"></el-table-column>
                <el-table-column prop="time" label="时间" class-name="col-40"></el-table-column>
                <el-table-column label="显示" class-name="col-20">
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.graphic" />
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
defineProps({
    list: { type: Array, default: () => [] },
    pagination: { type: Object, required: true },
    tableHeight: { type: Number, required: true },
    rowClassName: { type: Function, required: true },
});

defineEmits(['page-change']);
</script>

<style lang="scss" scoped>
.panel-section__title {
    margin-bottom: 10px;
}
</style>
