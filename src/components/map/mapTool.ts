/*
 * @Author: pmy
 * @Date: 2023-08-16 11:30:53
 * @LastEditors: pmy
 * @LastEditTime: 2023-09-22 09:00:13
 * @FilePath: \bdcar-net\src\components\map\mapTool.ts
 * @Description: 
 * Copyright (c) 2023 by pmy/exsun, All Rights Reserved. 
 */
//@ts-ignore
import request from '@/utils/request'

/**
 *  实时定位-区域查车
 *  pmy
 * @export
 * @return
 */
export async function getEquipByPolygon(data) {
    let url = "/comlbs/realtimePositioning/regionDeviceList";
    return request({
        url: url,
        method: 'post',
        data: data
    });
};

/**
 *  定位到地图位置
 *  pmy
 * @export
 * @return
 */
export async function getMatchQuery(data) {
    let url = "/comlbs/electricFence/matchQuery";
    return request({
        url: url,
        method: 'post',
        data: data
    });
};