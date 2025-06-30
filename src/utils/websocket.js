/*
 * @Author: your name
 * @Date: 2021-08-03 15:36:05
 * @LastEditTime: 2022-11-22 15:27:39
 * @LastEditors: pmy
 * @Description: In User Settings Edit
 * @FilePath: \bdcar-net\src\assets\js\websocket.js
 */

// 最大重连次数
const MAXConnectNum = 50;
/*定义一个类*/
export class myWebSocket {
    //Person类的公开属性，类的公开属性的定义方式是：this.属性名
    constructor(url) {
        this.socket = null;
        this.lockReconnet = null; //锁
        this.isReconnet = null; //是否重连
        this.globalCallback = null;
        this.sendData = null;
        this.wsUrl = url;
        this.connectNum = 0;
        this.heartInterval = null;

        this.createSocket();
    }
    createSocket = () => { //创建socket 
        try {
            const url = this.wsUrl;
            if ('WebSocket' in window) {
                this.socket = new WebSocket(url)
            } else if ('MozWebSocket' in window) {
                this.socket = new MozWebSocket(url)
            }
            this.initSocket()
        } catch (e) {
            this.reconnet(url)
        }
    }
    sendMsg = (data, callback) => { //发送数据,接收数据    
        setTimeout(() => {
            if (this.socket.readyState === 1) {
                this.globalCallback = callback;
                this.sendData = data;
                this.socket.send(data);
            } else {
                setTimeout(() => {
                    console.log(this.socket, '等待socket链接成功')
                    this.createSocket();
                    this.sendMsg(data, callback)
                }, 1500)
                return false
            }
        }, 1000);
        this.socket.onmessage = ev => {
            callback && callback(ev)
        }
    }
    initSocket = () => { //初始化websocket
        this.socket.onopen = () => {
            console.log('socket连接成功')
            this.heartCheck();

            if (this.isReconnet) { //执行全局回调函数
                //console.log('websocket重新连接了')
                this.sendMsg(this.sendData, this.globalCallback)
                this.isReconnet = false
            }
        }
        this.socket.onmessage = (ev) => {
            console.log(ev, '连接正常')
            this.heartCheck();
        }
        this.socket.onerror = () => {
            console.log('websocket服务出错了');
            this.reconnet(this.wsUrl)
        }
        this.socket.onclose = () => {
            console.log('websocket服务关闭了');
        }
    }
    // 重新连接websock函数，重连次数超过最大值后就不再重连
    reconnet = url => {        
        this.connectNum++;
        if (this.lockreconnet || this.connectNum >= MAXConnectNum)
            return false
        this.isReconnet = true;
        this.lockReconnet = true
        setTimeout(() => {
            this.createSocket(url)
            this.lockReconnet = false
        }, 2000)
    }
    heartCheck = () => {
        let timeout = 60 * 1000;
        this.heartInterval = setInterval(() => {
            if (this.socket.readyState === 1) {
                this.socket.send('heart test');
            } else {
                this.reconnet(this.wsUrl)
            }
        }, timeout)
    }
    close() {
        // 关闭websocket连接，清除重连
        this.socket.close();
        clearInterval(this.heartInterval);
    }
}