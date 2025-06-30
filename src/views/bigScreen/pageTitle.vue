<template>
    <div class="container">
        
    </div>
</template>

<script>

import dayjs from 'dayjs';
export default {
    data() {
        return {
            homeActive: "bigScreen",
            fullScreen: false,
            nowTime: dayjs().format("YYYY-MM-DD"),
            // 语言是否为中文
            language: true,
            curWeather: {},
        }
    },
    mounted() {
        
    },
    methods: {
        goToBigScreen(data) {
            window.open(data, '_self');
        },
        // 全屏切换
        changeScreenSize() {
            let element = document.documentElement;
            if (!this.fullScreen) {
                this.fullScreen = true
                // 判断浏览器设备类型
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {   // 兼容火狐
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {    // 兼容谷歌
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {   // 兼容IE
                    element.msRequestFullscreen();
                }
            } else {            // 退出全屏
                this.fullScreen = false
                //  退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        },
        
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 100%;
    height: 94px;

    .page-title {
        position: relative;
        height: 94px;
        z-index: 1;

        .img-top {
            display: inline-block;
        }

        .language {
            position: absolute;
            left: 148px;
            top: 5px;
            z-index: 10;
            background: rgba(0, 0, 0, 0.45);
            cursor: pointer;

            .img-size {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
        }

        .cur-weather {
            background: rgba(0, 0, 0, 0.45);
            height: 20px;
            border-radius: 4px;
            color: #fff;
            font-size: 16px;
            padding: 5px;
            width: fit-content;
            position: absolute;
            right: 50px;
            top: 10px;
            display: flex;
            align-items: center;


            .weather-img {
                width: 24px;
                height: 24px;
                margin-right: 6px;
            }

            .weather-str {
                margin-right: 6px;
            }

            .weather-num {
                font-size: 20px;
                font-family: Quantico;
            }
        }

        .img-left {
            width: 134px;
        }

        .img-center {
            width: 100%;
        }

        .img-right {
            width: 134px;
        }

        .page-time {
            position: absolute;
            left: 20px;
            top: 0;
            width: fit-content;
            padding: 8px 10px 6px 0px;
            font-size: 16px;
            font-family: Quantico;
            color: #CCDDD4;
            background: rgba(0, 0, 0, 0.40);
        }

        .page-search {
            position: absolute;
            width: 268px;
            left: calc(50% - 134px);
            top: 92px;

            .search-time {
                width: 268px;
            }
        }

        .page-search-other {
            width: 490px;
            left: calc(50% - 245px);
            display: flex;

            .search-acre {
                margin-left: 14px;
                width: 210px;

                :deep(.vue-treeselect__control) {
                    width: 208px;
                    background: #1D201E;
                    border: 1px solid rgba(30, 172, 99, 0.4);
                    border-radius: 2px;

                    .vue-treeselect__single-value {
                        color: #BDCBC3;
                        font-size: 16px;
                    }
                }
            }
        }

        .full-icon {
            position: absolute;
            right: 10px;
            top: 6px;
            width: 30px;
            height: 30px;
            background: url("@/assets/img/bigScreen/full-screen.png") no-repeat center;
            float: right;
            display: block;
            background-size: 100% 100%;
            cursor: pointer;
        }

        .full-small-icon {
            background: url("@/assets/img/bigScreen/full-screen-back.png") no-repeat center;
            background-size: 100% 100%;
        }

        .page-center {
            position: relative;
            display: inline-block;
            width: 100%;

            .page-btn {
                width: 155px;
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 18px;
                color: #EAEDF2;
                margin-top: 24px;
                background: url("@/assets/img/bigScreen/btn.png") no-repeat center;
                background-size: 100% 100%;
                position: absolute;
                top: -32px;
                cursor: pointer;
            }

            .page-btn.active,
            .page-btn:hover {
                background: url("@/assets/img/bigScreen/btn-active.png") no-repeat center;
                background-size: 100% 100%;
                color: #FBFFC7;
            }

            .screen-agri {
                left: calc(51% - 790px);
            }

            .screen-mine {
                left: calc(51% - 625px);
            }

            .screen-index {
                right: calc(51% - 605px);
            }

            .screen-detail {
                right: calc(51% - 770px);
            }
        }

        .more {
            width: 38px;
            height: 26px;
            background: url("@/assets/img/bigScreen/more.png") no-repeat center;
            background-size: 100% 100%;
            position: absolute;
            left: calc(51% - 470px);
            top: 4px;
            cursor: pointer;
            &:hover {
                .screen-car {
                    display: block;
                    top: 2px;
                    left: -59px;
                }
            }

            .screen-car {
                display: none;
            }
        }
    }
}
</style>