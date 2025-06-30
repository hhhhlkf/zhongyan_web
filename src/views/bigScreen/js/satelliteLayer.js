/*
 * @Author: nxx
 * @Date: 2023-07-14 11:50:15
 * @LastEditors: nxx
 * @LastEditTime: 2024-03-05 08:57:41
 * @FilePath: \web\src\views\bigScreen\js\satelliteLayer.js
 * @Description: 
 * Copyright (c) 2023 by nxx/exsun, All Rights Reserved. 
 */
import * as Cesium from "mars3d-cesium";
import * as mars3d from "mars3d";
import "mars3d-space";
import { ElMessage } from 'element-plus'
export const satelliteLayer = {
    map: null,
    satelliteObj: {},
    satelliteLayer: null, // 卫星及卫星轨迹
    dmzLayer: null, // 基站
    gltf: location.origin + '/weixin.gltf',
    lineImg:location.origin + '/line-arrow-dovetail.png',
    init(_map) {
        this.map = _map
        this.satelliteLayer = new mars3d.layer.GraphicLayer()
        _map.addLayer(this.satelliteLayer)
        this.dmzLayer = new mars3d.layer.GraphicLayer()
        _map.addLayer(this.dmzLayer)

        this.satelliteLayer.on(mars3d.EventType.change, (event) =>{
            // 位置变化事件
            this.processInArea(event.graphic)
        })

        let tle = GlobalSetting.tle
        this.createSatelliteList(tle)
        // mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle-china.json" })
        //     .then((data)=> {
        //         this.createSatelliteList(data.data)
        //     })
        //     .catch(function () {
        //         ElMessage.error('获取卫星信息异常！');
        //     })
    },
    // 创建卫星列表
    createSatelliteList(arr) {
        this.satelliteObj = {}
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i]

            // 属性处理
            item.model = {
                url: this.gltf,
                scale: 1,
                minimumPixelSize: 50,
                ...(item.model || {}),
                distanceDisplayCondition: true,
                distanceDisplayCondition_near: 0,
                // distanceDisplayCondition_far: 20000000
            }
            // 当视角距离超过20000000米(distanceDisplayCondition_far定义的) 后显示为点对象的样式
            item.point = {
                color: "#ffff00",
                pixelSize: 5,
                distanceDisplayCondition: true,
                distanceDisplayCondition_near: 20000000,
                distanceDisplayCondition_far: Number.MAX_VALUE
            }

            item.label = item.label || {
                color: "#ffffff",
                opacity: 1,
                font_size: 30,
                font_family: "楷体",
                outline: true,
                outlineColor: "#000000",
                outlineWidth: 3,
                background: true,
                backgroundColor: "#000000",
                backgroundOpacity: 0.5,
                pixelOffsetY: -20,
                scaleByDistance: true,
                scaleByDistance_far: 10000000,
                scaleByDistance_farValue: 0.4,
                scaleByDistance_near: 100000,
                scaleByDistance_nearValue: 1
            }
            item.label.text = item.name
           
            // path显示后FPS下降的厉害
            item.path = item.path || {}
            if(item.name.includes('G') ){
				item.path.color = '#4B78AE'
			}else if(item.name.includes('I') ){
				item.path.color = '#3F7C62'
			}else if(item.name.includes('M')){
				item.path.color = '#78622D'
			}
            item.path.color = Cesium.defaultValue(item.path.color,'#e2e2e2')
            // item.path.opacity = 0.3
            item.path.width = 0.5;
            item.path.closure = false

            item.cone = {
                sensorType: i % 2 === 1 ? mars3d.graphic.SatelliteSensor.Type.Rect : mars3d.graphic.SatelliteSensor.Type.Conic,
                angle1: this.random(20, 40),
                angle2: this.random(10, 20),
                color: "rgba(0,255,0,0.5)",
                show: false
            }
            item.show = true
            // 属性处理  END
            const satelliteObj = new mars3d.graphic.Satellite(item)
            this.satelliteLayer.addGraphic(satelliteObj)
            this.satelliteObj[item.name] = satelliteObj
        }
        console.log("当前卫星数量: " + arr.length)

        this.satelliteLayer.bindPopup(function (event) {
            const attr = event.graphic.options
            return `名称：${attr.name}<br/>编号：${attr.norad || ""}`
        })
    },
    // 创建地面站
    creatreDmzList(list) {
        // 创建矢量数据图层
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            const dmfwGraphic = new mars3d.graphic.CircleEntity({
                name: item.deviceName,
                position: [item.lng, item.lat],
                style: {
                    radius: 5000000,
                    color: "#ff0000",
                    opacity: 0
                },
            })
            this.dmzLayer.addGraphic(dmfwGraphic)
            // 判断时会用到的变量
            dmfwGraphic._isFW = true
            dmfwGraphic._lastInPoly = {}
        }
    },
    // 判断卫星是否在面内
    processInArea(weixin) {
        let _map = this.map
        let _lineImg = this.lineImg
        let position = weixin?.position
        if (!position || !this.dmzLayer) return

        this.dmzLayer.eachGraphic(function (dmzGraphic) {
            if (!dmzGraphic._isFW) {
                return
            }
            dmzGraphic._lastInPoly[weixin.id] = dmzGraphic._lastInPoly[weixin.id] || {}
            let lastState = dmzGraphic._lastInPoly[weixin.id]
        
            let thisIsInPoly = dmzGraphic.isInPoly(position)
            if (thisIsInPoly !== lastState.state) {
                if (thisIsInPoly) {
                    // 开始进入区域内
                    console.log(`${weixin.name} 卫星开始进入 ${dmzGraphic.name} 地面站区域内`)
            
                    let line = new mars3d.graphic.PolylineEntity({
                        positions: new Cesium.CallbackProperty(function (time) {
                            let pots = weixin.position
                        if (!pots) {
                            return []
                        }
                        return [pots, dmzGraphic.positionShow]
                        }, false),
                        style: {
                        width: 7,
                        // 动画线材质
                        materialType: mars3d.MaterialType.LineFlow,
                        materialOptions: {
                            url: _lineImg,
                            // color: Cesium.Color.AQUA,
                            repeat: new Cesium.Cartesian2(15, 1),
                            speed: 60 // 时长，控制速度
                        },
                        arcType: Cesium.ArcType.NONE
                        }
                    })
                    _map.graphicLayer.addGraphic(line)
                    lastState.line = line
            
                    // weixin.coneShow = true // 打开视锥体
                } else {
                    // 离开区域
                    console.log(`${weixin.name} 卫星离开 ${dmzGraphic.name} 地面站区域内`)
            
                    if (lastState.line) {
                        _map.graphicLayer.removeGraphic(lastState.line)
                        delete lastState.line
                    }
                    // weixin.coneShow = false // 关闭视锥体
                }
                dmzGraphic._lastInPoly[weixin.id].state = thisIsInPoly
            }
        })
    },
    toggleLayer(type) {
        if (type) {
            this.map.removeLayer(this.satelliteLayer)
        } else {
            this.map.addLayer(this.satelliteLayer)
        }
    },
    removeDmzLayer(){
        this.dmzLayer.eachGraphic((dmzGraphic)=>{
            let lastState = dmzGraphic._lastInPoly
            Object.values(dmzGraphic._lastInPoly).forEach(lastState=>{
                if (lastState.line) {
                    this.map.graphicLayer.removeGraphic(lastState.line)
                }
            })
        })
        this.dmzLayer.clear()
    },
    toSatellite(obj){
        let sate = this.satelliteObj[obj.name]
        this.map.flyToGraphic(sate, {
            duration: 4,
            complete: (e)=> {
                this.satelliteLayer.openPopup(sate)
            }
        })
    },
    // 取随机数字
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}