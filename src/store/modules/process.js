/*
 * @Author: Linexus && likefan2002@gmail.com
 * @Date: 2025-06-16 10:24:38
 * @LastEditors: hhhhlkf 153648356@qq.com
 * @LastEditTime: 2025-06-19 17:18:59
 * @FilePath: \web\src\store\modules\process.js
 * @Description: 
 * 
 * Copyright (c) 2025 by Linexus, All Rights Reserved. 
 */
import { defineStore } from 'pinia';
import * as mars3d from "mars3d";
import { graphic } from 'echarts';
import { watch } from 'vue';
import * as Cesium from "mars3d-cesium";
export const useProcessStore = defineStore('process', {
    state: () => ({
        lists: {
            /*
                * rgb接收格式
                * {
                * id: 文件ID,
                * name: 文件名,
                * time: 接收时间,
                * graphic: 是否直接显示在界面上,
                * poly: 图片坐标，是左上角右下角经纬度格式，举个例子: [{ lat: 30.0, lng: 120.0 }, { lat: 29.0, lng: 121.0 }]
                * task: 任务类型, 例如: 'rgb', 'llt', 'hsi' 等等
                * path: 文件路径, 例如: 'http://localhost:8088/v2/images/gansu/UAV_00_00.png',
                * type: 是处理结果还是收集结果, 例如: 'collect', 'process', 'history' 等等
                * }  
             */
            // { id: 1, name: '文件1', time: '2023-10-01 10:00', graphic: true },
            //     { id: 2, name: '文件2', time: '2023-10-01 11:00', graphic: false },
            //     { id: 3, name: '文件3', time: '2023-10-01 12:00', graphic: true },
            //     { id: 4, name: '文件4', time: '2023-10-01 13:00', graphic: false },
            rgb: {
                collect: [],
                process: [], // 处理结果列表
                history: [], // 历史记录
            },
            /*
                * llt接收格式
                * {
                * id: 文件ID,
                * name: 文件名,
                * time: 接收时间,
                * graphic: 是否直接显示在界面上,
                * poly: 图片坐标，举个例子: [{ lat: 30.0, lng: 120.0 }];
                * }  
             */
            llt: {
                collect: [],
                process: [],
                history: [], // 历史记录
            },
            /*
                * llt接收格式
                * {
                * id: 文件ID,
                * name: 文件名,
                * time: 接收时间,
                * graphic: 是否直接显示在界面上,
                * poly: 图片坐标，举个例子: [{ lat: 30.0, lng: 120.0 }];
                * }  
             */
            hsi: {
                collect: [],
                process: [],
                history: [], // 历史记录
            },
            patchList: [], // 公共列表，不属于特定模态
            flyToFlag:true
        },
        watchers: {},
        drawer: {
            rgb: false, // RGB抽屉状态
            llt: false, // LLT抽屉状态
            hsi: false, // HSI抽屉状态
        },
        _graphicCallbacks: {
            create: null,
            del: null,
            revise: null,
            clear: null,
        }
    }),
    actions: {

        registerGraphicCallbacks({ createGraphic, delGraphic, reviseGraphic, clearGraphic }) {
            this._graphicCallbacks.create = createGraphic
            this._graphicCallbacks.del = delGraphic
            this._graphicCallbacks.revise = reviseGraphic
            this._graphicCallbacks.clear = clearGraphic
        },

        // 设置rgb_drawer状态
        setRgbDrawer(status) {
            this.drawer.rgb = status;
            console.log("set rgb_drawer in store: ", status);
        },
        // 设置llt_drawer状态
        setLltDrawer(status) {
            this.drawer.llt = status;
        },

        // 设置hsi_drawer状态
        setHsiDrawer(status) {
            this.drawer.hsi = status;
            console.log("set hsi_drawer in store: ", status);
        },

        // 获取当前图形
        // createGraphic(item) {
        //     console.log("graphicLayer: ", item.type, item.poly[0]);
        //     if (item.type === 'rgb') {

        //         const graphic = new mars3d.graphic.PolygonPrimitive({
        //             positions: this.convertToSurroundingPoints(item),
        //             id: item.id,
        //             style: {
        //                 // color: arrColor[graphicLayer.length % arrColor.length],
        //                 image: "http://" + item.url,
        //                 clampToGround: true,
        //                 // image: `http://localhost:8088/v2/images/gansu/UAV_00_00.png`,
        //                 // stRotationDegree: fixedRoute.model.heading,
        //                 zIndex: item.name.includes('O') ? this.graphicLayer.length + 1000 : this.graphicLayer.length,
        //             }
        //         })
        //         this.graphicLayer.addGraphic(graphic); // 将图形对象添加到图形层
        //         // console.log("成功添加！")
        //         this.lists.patchList.push(
        //             {
        //                 id: graphic.id,
        //                 graphic: graphic
        //             }
        //         )
        //         this.lists.patchList.forEach(item => {
        //             console.log("patchList: ", item);
        //         });

        //     } else {
        //         // console.log("here is createPoint");
        //         this.createPoint(item); // 针对微光红外图片和高光谱图片创建点对象
        //     }
        // },

        // 针对微光红外图片和高光谱图片创建点对象
        // TODO 等到有了微光红外图片和高光谱图片的具体数据格式后再完善
        // createPoint(item, lng = null, lat = null) {
        //     let htmlContent = `<table style="width:280px;">
        //     <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">灾害现场</th></tr>
        //     <tr><td colspan="4" style="text-align:center;"><img src="${"http://" + item.path}" alt="Image" style="max-width:100%;"></td></tr>
        //     </table>`;
        //     const baseUrl = item.path.split('/static/')[0];
        //     // console.log("baseUrl: ", baseUrl)
        //     if (lng && lat) {
        //         item.lngmin = lng
        //         item.latmin = lat
        //     }
        //     const graphic = new mars3d.graphic.BillboardEntity({
        //         position: new mars3d.LngLatPoint(item.lngmin, item.latmin, 0),
        //         id: item.id,
        //         style: {

        //             image: 'http://' + baseUrl + '/static/poly.png',
        //             horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //             verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //             label: {
        //                 pixelOffsetY: -45,
        //                 horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //                 verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        //             }
        //         },
        //     })
        //     this.graphicLayer.addGraphic(graphic)
        //     this.lists.patchList.push(
        //         {
        //             id: graphic.id,
        //             graphic: graphic
        //         }
        //     )
        //     // 绑定Popup
        //     graphic.bindTooltip(htmlContent, { offsetY: -30, pointerEvents: true }).openTooltip()
        // },

        // delGraphic(item) {
        //     const index = this.lists.patchList.findIndex((i) => {
        //         console.log("i: ", i.id, "item: ", item.id);
        //         return i.id === item.id;
        //     });

        //     console.log("index: ", index, "item: ", item.id);
        //     if (index !== -1) {
        //         console.log("正在删除", item.type)
        //         this.drawer.rgb = false; // 关闭rgb_drawer
        //         this.graphicLayer.removeGraphic(this.lists.patchList[index].graphic); // 从图形层中删除图形对象
        //         this.lists.patchList.splice(index, 1); // 从公共列表中删除
        //     }
        // },

        convertToSurroundingPoints(item) {
            const surroundingPoints = [
                [item.poly[0].lng, item.poly[1].lat, 0],
                [item.poly[1].lng, item.poly[1].lat, 0],
                [item.poly[1].lng, item.poly[0].lat, 0],
                [item.poly[0].lng, item.poly[0].lat, 0]
            ]
            console.log("surroundingPoints: ", surroundingPoints);
            return surroundingPoints
        },

        getFlyToFlag() {
            return this.flyToFlag;
        },

        setFlyToFlag(flag) {
            this.flyToFlag = flag;
            console.log("set flyToFlag in store: ", flag);
        },

        // 动态设置列表内容
        setList(modal, listType, list) {
            if (!this.lists[modal]) {
                this.lists[modal] = { collect: [], process: [], history: [] }; // 初始化模态结构
            }
            this.lists[modal][listType] = list;
        },

        // 获取列表内容
        getList(modal, listType) {
            // console.log(`Getting list for modal: ${modal}, listType: ${listType}`);
            return this.lists[modal]?.[listType] || []; // 如果列表不存在，返回空数组
        },

        // 清空列表内容
        clearList(modal, listType) {
            if (this.lists[modal]?.[listType]) {
                // 删除对应的图形对象
                // this.lists[modal][listType].forEach(item => {
                //     const graphicIndex = this.lists.patchList.findIndex(g => g.id === item.id);
                //     if (graphicIndex !== -1) {
                //         this.delGraphic(item)
                //     }
                // });
                this._graphicCallbacks.clear?.(this.lists[modal][listType]);
                this.lists[modal][listType] = [];
            }
        },

        // 向列表中添加项
        addItemToList(modal, listType, item) {
            if (!this.lists[modal]) {
                this.lists[modal] = { collect: [], process: [], history: [] }; // 初始化模态结构
            }
            this.lists[modal][listType].push(item);
        },
        // 向列表中添加多个项
        addItemsToList(modal, listType, items) {
            // console.log(modal, listType, items);
            if (!this.lists[modal]) {
                // console.log(`Adding items to ${modal} ${listType}:`, items);
                this.lists[modal] = { collect: [], process: [], history: [] }; // 初始化模态结构
            }
            this.lists[modal][listType].push(...items);
        },

        // 删除模态
        deleteModal(modal) {
            if (this.lists[modal]) {
                delete this.lists[modal];
            }
        },

        watchList(modal, listType) {
            const key = `${modal}_${listType}`;
            // 如果已经添加了监听器，则跳过
            if (this.watchers[key]) {
                console.warn(`Watcher for ${key} already exists.`);
                return;
            }

            // 确保列表存在
            if (!this.lists[modal]?.[listType]) {
                console.error(`List ${listType} for modal ${modal} does not exist.`);
                return;
            }

            // 添加监听器
            let oldListClone = JSON.parse(JSON.stringify(this.lists[modal][listType]));

            this.watchers[key] = watch(
                () => this.lists[modal][listType],
                (newList) => {
                    if (listType !== 'history') {
                        newList.forEach((newItem, index) => {
                            console.log('newItem and oldItem:', newItem.graphic)
                            this._graphicCallbacks.revise?.(newItem);
                        });
                    } else {
                        newList.forEach((newItem, index) => {
                            const oldItem = oldListClone[index];
                            if (!oldItem) return;

                            const hasGraphicChanged = oldItem.graphic !== newItem.graphic;
                            console.log('newItem and oldItem:', newItem.graphic, oldItem.graphic);
                            if (hasGraphicChanged) {
                                console.log(`Checking graphic change for item at index ${index}:`, newItem);
                                newItem.graphic ? this._graphicCallbacks.create?.(newItem) : this._graphicCallbacks.del?.(newItem);
                            }
                        });
                    }

                    // 更新克隆的旧值
                    oldListClone = JSON.parse(JSON.stringify(newList));
                },
                { deep: true, immediate: true }
            );

        },

        // 清理监听器
        unwatchList(modal, listType) {
            const key = `${modal}_${listType}`;
            if (this.watchers[key]) {
                this.watchers[key](); // 调用监听器的清理方法
                delete this.watchers[key]; // 删除记录
                console.log(`Watcher for ${key} has been removed.`);
            } else {
                console.warn(`No watcher found for ${key}.`);
            }
        },
    },
});
