/*
 * @Author: your name
 * @Date: 2021-08-11 10:09:22
 * @LastEditTime: 2023-09-22 10:21:42
 * @LastEditors: pmy
 * @Description: 生成树文件
 * @FilePath: \bdcar-net\src\utils\createTree.js
 */
export class TreeCreate {
    constructor(data, treeConfig) {
        this.treeConfig = Object.assign({
            pId: 'parentId', // 父节点字段名
            pId2: '', // 父节点字段名拓展字段
            id: 'id', // 该节点的id字段名
            id2: '', // 节点的id字段名拓展字段
            rootId: '0', // 根节点id
            rootText: "平台设备",
        }, treeConfig)
        this.treeData = this.init(data); // 树状的树数据
    }
    // 按 fId 分组生成一个数组
    groupBy(data) {
        let config = this.treeConfig;
        let group = []; //挂树使用    
        data.forEach(v => {
            let key = v[config.pId] ?? v[config.pId2]
            // 挂树使用
            group.hasOwnProperty(key) ? group[key].push(v) : group[key] = [v]
            // 统计使用
            if (v.type == 0) {
                v.total = 0;
                v.onlineNum = 0;
            }
            // 使用id或者备用id
            v.id = v[config.id] ?? v[config.id2]
        })
        return group
    }
    // 树生成, 递归调用
    // data为分组后的数据，不断的找parent去挂在children
    createTree(data, parent = null) {
        let config = this.treeConfig, treeData = [], pid;

        pid = parent === null ? config.rootId : parent.id

        if (data.hasOwnProperty(pid)) {
            data[pid].forEach(val => {
                let t = JSON.parse(JSON.stringify(val))
                //Object.assign生成对象的方法，如果属性值存在则覆盖，不存在则新增
                t.children = this.createTree(data, t)
                //给树数据新增一个节点然后挂在children
                treeData.push(t)
            })
        }
        return treeData
    }
    // 生成树
    init(data) {
        return this.createTree(this.groupBy(data))
    }
    // 获取树数据
    getData() {
        return {
            id: this.treeConfig.rootId,
            text: this.treeConfig.rootText,
            label: this.treeConfig.rootText,
            total: 0,
            onlineNum: 0,
            type: 0,
            children: JSON.parse(JSON.stringify(this.treeData))
        }
    }
}
//计算叶子数目
export function countLeaves(pNode, sNode) {
    if (sNode.type === 0) {
        sNode?.children.forEach(v => {
            countLeaves(sNode, v);
        });
        if (pNode) {
            pNode.total += sNode.total;
            pNode.onlineNum += sNode.onlineNum;
        }
    } else {
        pNode.total++;
        if (sNode.onlineStatus) pNode.onlineNum++;
    }
};