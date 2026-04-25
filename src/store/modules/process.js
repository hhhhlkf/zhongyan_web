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

function createListPagination(pageSize = 10) {
    return {
        page: 1,
        pageSize,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        snapshotTime: null,
    };
}

function createHistoryPagination() {
    return createListPagination(5);
}

function createModalLists() {
    return {
        collect: [],
        process: [],
        history: [],
        collectPagination: createListPagination(10),
        processPagination: createListPagination(10),
        historyPagination: createHistoryPagination(),
    };
}

function normalizeListItemId(id) {
    return id == null ? '' : String(id);
}

function getListDeleteKey(item) {
    return normalizeListItemId(item?.name || item?.fileName || item?.id);
}

function normalizeCoordinatePoint(point = {}) {
    const lng = Number(point?.lng ?? point?.lon ?? point?.longitude ?? point?.x);
    const lat = Number(point?.lat ?? point?.latitude ?? point?.y);
    const alt = Number(point?.alt ?? point?.height ?? point?.z ?? 0);

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
        return null;
    }

    return { lng, lat, alt };
}

// 关键修改：workbench 新链路只接受四点 poly，避免再从 corners/矩形边界反推坐标。
function buildPolyFromBounds(item = {}) {
    const lngmin = Number(item?.lngmin);
    const lngmax = Number(item?.lngmax);
    const latmin = Number(item?.latmin);
    const latmax = Number(item?.latmax);

    if ([lngmin, lngmax, latmin, latmax].some((value) => Number.isNaN(value))) {
        return [];
    }

    return [
        { lng: lngmin, lat: latmax, alt: 0 },
        { lng: lngmax, lat: latmax, alt: 0 },
        { lng: lngmax, lat: latmin, alt: 0 },
        { lng: lngmin, lat: latmin, alt: 0 },
    ];
}

function createRecentWatchSnapshot(item = {}) {
    return {
        id: normalizeListItemId(item?.id),
        graphic: item?.graphic ?? true,
    };
}

// 关键修改：recent 数据优先使用 poly，缺失时回退到 corners 或经纬度边界，确保底图贴图链路不断。
function normalizePoly(item = {}) {
    const rawPoly = Array.isArray(item?.poly) && item.poly.length
        ? item.poly
        : (Array.isArray(item?.corners) ? item.corners : []);
    if (rawPoly.length < 4) {
        return buildPolyFromBounds(item);
    }

    const poly = rawPoly
        .map((point) => normalizeCoordinatePoint(point))
        .filter(Boolean);

    if (poly.length < 4) {
        return buildPolyFromBounds(item);
    }

    return poly.slice(0, 4);
}

function normalizeUavPosition(item = {}) {
    return normalizeCoordinatePoint(
        item?.uavPosition || item?.sourcePosition || item?.position || {
            lng: item?.lng,
            lat: item?.lat,
            alt: item?.alt,
        }
    );
}

function normalizeRecentListItem(item = {}, listType = 'collect') {
    const id = normalizeListItemId(item?.id || item?.captureId || item?.resultId || item?.fileName || item?.name);
    const task = item?.task || listType;
    const source = item?.source || (listType === 'history' ? 'history' : `recent-${listType}`);
    const name = item?.name || item?.fileName || id;
    const time = item?.time || item?.fileDate || item?.captureTime || item?.resultTime || item?.createdAt || '';
    const imageUrl = item?.imageUrl || item?.resultUrl || item?.url || item?.path || '';
    const poly = normalizePoly(item);
    const lngList = poly.map((point) => point.lng);
    const latList = poly.map((point) => point.lat);

    return {
        ...item,
        id,
        name,
        time,
        task,
        source,
        graphic: item?.graphic ?? (listType === 'history' ? false : true),
        imageUrl,
        corners: poly,
        poly,
        lngmin: poly.length ? Math.min(...lngList) : Number(item?.lngmin),
        lngmax: poly.length ? Math.max(...lngList) : Number(item?.lngmax),
        latmin: poly.length ? Math.min(...latList) : Number(item?.latmin),
        latmax: poly.length ? Math.max(...latList) : Number(item?.latmax),
        imageType: item?.imageType || task,
        captureId: item?.captureId || item?.id || '',
        missionId: item?.missionId || '',
        captureTime: item?.captureTime || item?.fileDate || '',
        resultTime: item?.resultTime || '',
        sourcePosition: normalizeCoordinatePoint(item?.sourcePosition) || normalizeUavPosition(item),
        uavPosition: normalizeUavPosition(item),
    };
}

export const useProcessStore = defineStore('process', {
    state: () => ({
        lists: {
            // Modal item shape: { id, name, time, graphic, poly[4], task, path, type }
            rgb: {
                collect: [],
                process: [], // Process list
                history: [], // History list
                collectPagination: createListPagination(10),
                processPagination: createListPagination(10),
                historyPagination: createHistoryPagination(),
            },
            llt: {
                collect: [],
                process: [], // Process list
                history: [], // History list
                collectPagination: createListPagination(10),
                processPagination: createListPagination(10),
                historyPagination: createHistoryPagination(),
            },
            hsi: {
                collect: [],
                process: [], // Process list
                history: [], // History list
                collectPagination: createListPagination(10),
                processPagination: createListPagination(10),
                historyPagination: createHistoryPagination(),
            },
            patchList: [], // Shared graphic list
        },
        flyToFlag: true,
        watchers: {},
        _graphicCallbacks: {
            create: null,
            del: null,
            revise: null,
            clear: null,
            focus: null,
        }
    }),
    actions: {
        ensureModalLists(modal) {
            if (!this.lists[modal]) {
                this.lists[modal] = createModalLists();
            }
            if (!this.lists[modal].collectPagination) {
                this.lists[modal].collectPagination = createListPagination(10);
            }
            if (!this.lists[modal].processPagination) {
                this.lists[modal].processPagination = createListPagination(10);
            }
            if (!this.lists[modal].historyPagination) {
                this.lists[modal].historyPagination = createHistoryPagination();
            }
            return this.lists[modal];
        },

        registerGraphicCallbacks({ createGraphic, delGraphic, reviseGraphic, clearGraphic, focusGraphic }) {
            this._graphicCallbacks.create = createGraphic;
            this._graphicCallbacks.del = delGraphic;
            this._graphicCallbacks.revise = reviseGraphic;
            this._graphicCallbacks.clear = clearGraphic;
            this._graphicCallbacks.focus = focusGraphic;
        },

        // Get current graphic
        // createGraphic(item) {
        //     console.log('graphicLayer: ', item.type, item.poly[0]);
        //     if (item.type === 'rgb') {
        //         const graphic = new mars3d.graphic.PolygonPrimitive({
        //             positions: this.convertToSurroundingPoints(item),
        //             id: item.id,
        //             style: {
        //                 image: 'http://' + item.url,
        //                 clampToGround: true,
        //                 zIndex: item.name.includes('O') ? this.graphicLayer.length + 1000 : this.graphicLayer.length,
        //             }
        //         });
        //         this.graphicLayer.addGraphic(graphic); // Add graphic to layer
        //         this.lists.patchList.push({
        //             id: graphic.id,
        //             graphic,
        //         });
        //     } else {
        //         this.createPoint(item); // Create a point for LLT or HSI data
        //     }
        // },

        // Create a point for LLT or HSI data
        // TODO Complete this after the final data format is confirmed
        // createPoint(item, lng = null, lat = null) {
        //     let htmlContent = `<table style="width:280px;">
        //     <tr><th scope="col" colspan="4" style="text-align:center;font-size:15px;">Preview</th></tr>
        //     <tr><td colspan="4" style="text-align:center;"><img src="${'http://' + item.path}" alt="Image" style="max-width:100%;"></td></tr>
        //     </table>`;
        //     const baseUrl = item.path.split('/static/')[0];
        //     if (lng && lat) {
        //         item.lngmin = lng;
        //         item.latmin = lat;
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
        //                 verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //             },
        //         },
        //     });
        //     this.graphicLayer.addGraphic(graphic);
        //     this.lists.patchList.push({
        //         id: graphic.id,
        //         graphic,
        //     });
        //     // Bind tooltip
        //     graphic.bindTooltip(htmlContent, { offsetY: -30, pointerEvents: true }).openTooltip();
        // },

        // delGraphic(item) {
        //     const index = this.lists.patchList.findIndex((i) => i.id === item.id);
        //     if (index !== -1) {
        //         this.graphicLayer.removeGraphic(this.lists.patchList[index].graphic); // Remove from layer
        //         this.lists.patchList.splice(index, 1); // Remove from shared list
        //     }
        // },

        convertToSurroundingPoints(item) {
            const surroundingPoints = Array.isArray(item?.poly)
                ? item.poly
                    .map((point) => normalizeCoordinatePoint(point))
                    .filter(Boolean)
                    .slice(0, 4)
                    .map((point) => [point.lng, point.lat, point.alt ?? 0])
                : [];
            console.log('surroundingPoints: ', surroundingPoints);
            return surroundingPoints;
        },

        getFlyToFlag() {
            return this.flyToFlag;
        },

        setFlyToFlag(flag) {
            this.flyToFlag = flag;
            console.log('set flyToFlag in store: ', flag);
        },

        // Set list content
        setList(modal, listType, list) {
            const modalLists = this.ensureModalLists(modal);
            modalLists[listType] = list;
        },

        // Get list content
        getList(modal, listType) {
            return this.lists[modal]?.[listType] || []; // Return an empty array when the list is missing
        },

        removeItemsFromList(modal, listType, keys = []) {
            const modalLists = this.ensureModalLists(modal);
            const normalizedKeys = new Set(keys.map((key) => normalizeListItemId(key)).filter(Boolean));
            if (!normalizedKeys.size) {
                return [];
            }

            // Key change: remove displayed graphics before mutating list data so map state stays in sync.
            const removedItems = modalLists[listType].filter((item) => normalizedKeys.has(getListDeleteKey(item)));
            if (!removedItems.length) {
                return [];
            }

            this._graphicCallbacks.clear?.(removedItems);
            modalLists[listType] = modalLists[listType].filter((item) => !normalizedKeys.has(getListDeleteKey(item)));
            return removedItems;
        },

        // Clear list content
        clearList(modal, listType) {
            if (this.lists[modal]?.[listType]) {
                // Clear related graphics for the current list
                this._graphicCallbacks.clear?.(this.lists[modal][listType]);
                this.lists[modal][listType] = [];
            }
        },

        // Add one item to a list
        addItemToList(modal, listType, item) {
            const modalLists = this.ensureModalLists(modal);
            modalLists[listType].push(item);
        },

        // Add multiple items to a list
        addItemsToList(modal, listType, items) {
            const modalLists = this.ensureModalLists(modal);
            modalLists[listType].push(...items);
        },

        // 关键修改：轮询接口返回的是 PageResponse，这里统一提取 fileList 并维护 snapshotTime。
        appendRecentPageData(modal, listType, payload = {}) {
            const modalLists = this.ensureModalLists(modal);
            const paginationKey = `${listType}Pagination`;
            const currentList = Array.isArray(modalLists[listType]) ? modalLists[listType] : [];
            const incomingList = Array.isArray(payload?.fileList) ? payload.fileList : [];
            const normalizedIncomingList = incomingList.map((item) => normalizeRecentListItem(item, listType));
            const existingIds = new Set(currentList.map((item) => normalizeListItemId(item?.id)).filter(Boolean));
            const nextItems = normalizedIncomingList.filter((item) => !existingIds.has(normalizeListItemId(item?.id)));

            modalLists[listType].push(...nextItems);
            nextItems.forEach((item) => {
                this._graphicCallbacks.revise?.(item);
            });

            if (modalLists[paginationKey]) {
                modalLists[paginationKey].snapshotTime = payload?.snapshotTime ?? null;
            }
        },

        // Key change: keep paged list data and pagination metadata together in the store.
        setPagedListData(modal, listType, payload = {}) {
            const modalLists = this.ensureModalLists(modal);
            const {
                fileList = [],
                page = 1,
                pageSize = listType === 'history' ? 5 : 10,
                total = 0,
                totalPages = 0,
                hasNext = false,
                hasPrevious = false,
                snapshotTime = null,
            } = payload;
            const paginationKey = `${listType}Pagination`;

            this._graphicCallbacks.clear?.(modalLists[listType]);
            modalLists[listType] = Array.isArray(fileList)
                ? fileList.map((item) => normalizeRecentListItem(item, listType))
                : [];
            modalLists[paginationKey] = {
                page,
                pageSize,
                total,
                totalPages,
                hasNext,
                hasPrevious,
                snapshotTime,
            };
        },

        setHistoryPageData(modal, payload = {}) {
            this.setPagedListData(modal, 'history', payload);
        },

        getListPagination(modal, listType) {
            const fallback = listType === 'history' ? createHistoryPagination() : createListPagination(10);
            return this.lists[modal]?.[`${listType}Pagination`] || fallback;
        },

        getHistoryPagination(modal) {
            return this.getListPagination(modal, 'history');
        },

        resetListPagination(modal, listType) {
            const modalLists = this.ensureModalLists(modal);
            const paginationKey = `${listType}Pagination`;
            const fallback = listType === 'history' ? createHistoryPagination() : createListPagination(10);
            this._graphicCallbacks.clear?.(modalLists[listType]);
            modalLists[listType] = [];
            modalLists[paginationKey] = fallback;
        },

        resetHistoryPagination(modal) {
            this.resetListPagination(modal, 'history');
        },

        deleteModal(modal) {
            if (this.lists[modal]) {
                delete this.lists[modal];
            }
        },

        watchList(modal, listType) {
            const key = `${modal}_${listType}`;
            // Skip when a watcher already exists for this list
            if (this.watchers[key]) {
                console.warn(`Watcher for ${key} already exists.`);
                return;
            }

            // Make sure the target list exists before watching it
            if (!this.lists[modal]?.[listType]) {
                console.error(`List ${listType} for modal ${modal} does not exist.`);
                return;
            }

            // Keep a lightweight snapshot so recent polling only reacts to checkbox visibility changes.
            let oldListClone = this.lists[modal][listType].map((item) => createRecentWatchSnapshot(item));

            this.watchers[key] = watch(
                () => this.lists[modal][listType],
                (newList) => {
                    if (listType !== 'history') {
                        const oldGraphicMap = new Map(
                            oldListClone.map((item) => [normalizeListItemId(item?.id), item?.graphic])
                        );
                        newList.forEach((newItem) => {
                            const itemId = normalizeListItemId(newItem?.id);
                            if (!itemId || !oldGraphicMap.has(itemId)) {
                                return;
                            }

                            const oldGraphic = oldGraphicMap.get(itemId);
                            if (oldGraphic !== newItem.graphic) {
                                this._graphicCallbacks.revise?.(newItem);
                            }
                        });
                    } else {
                        newList.forEach((newItem, index) => {
                            const oldItem = oldListClone[index];
                            if (!oldItem) return;

                            const hasGraphicChanged = oldItem.graphic !== newItem.graphic;
                            console.log('newItem and oldItem:', newItem.graphic, oldItem.graphic);
                            if (hasGraphicChanged) {
                                console.log(`Checking graphic change for item at index ${index}:`, newItem);
                                if (newItem.graphic) {
                                    // 历史记录勾选显示时，先创建图形再触发地图聚焦。
                                    this._graphicCallbacks.create?.(newItem);
                                    this._graphicCallbacks.focus?.(newItem);
                                } else {
                                    this._graphicCallbacks.del?.(newItem);
                                }
                            }
                        });
                    }

                    // Refresh the cloned snapshot
                    oldListClone = listType === 'history'
                        ? JSON.parse(JSON.stringify(newList))
                        : newList.map((item) => createRecentWatchSnapshot(item));
                },
                { deep: true, immediate: true }
            );
        },

        // Remove a watcher for the current list
        unwatchList(modal, listType) {
            const key = `${modal}_${listType}`;
            if (this.watchers[key]) {
                this.watchers[key](); // Run the watcher cleanup function
                delete this.watchers[key]; // Remove the watcher record
                console.log(`Watcher for ${key} has been removed.`);
            } else {
                console.warn(`No watcher found for ${key}.`);
            }
        },
    },
});
