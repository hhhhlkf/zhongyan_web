/*
 * @Author: nxx
 * @Date: 2023-07-14 11:50:15
 * @LastEditors: nxx
 * @LastEditTime: 2024-01-09 15:22:16
 * @FilePath: \web\src\views\bigScreen\js\cameraFlv.js
 * @Description: 
 * Copyright (c) 2023 by nxx/exsun, All Rights Reserved. 
 */
import flv from 'flv.js'
import { ElMessage } from 'element-plus'
export const cameraFlv = {
    videoPlay($el, url) {
        try {
            if (flv.isSupported()) {
                let videoElement, videoObj;
                videoElement = $el;

                videoObj = flv.createPlayer({
                    type: 'flv',
                    isLive: true,
                    stashInitialSize: 128,// 减少首桢显示等待时长
                    url: url
                });
                videoObj.attachMediaElement(videoElement);
                videoObj.load();
                videoObj.play();
            } else {
                console.log("暂不支持flv.js")
            }
        } catch (e) {
            ElMessage.error('视频播放失败');
        }
    }
}