export const modalConfigs = {
    rgb: {
        key: 'rgb',
        type: 'rgb',
        label: 'RGB',
        title: 'RGB数据拍摄处理',
        entryLabel: 'RGB模块',
        themeClass: 'theme-rgb',
        statusText: '可见光采集链路',
        speedMin: 3,
        speedMax: 10,
    },
    llt: {
        key: 'llt',
        type: 'llt',
        label: 'LLT',
        title: 'LLT数据拍摄处理',
        entryLabel: 'LLT模块',
        themeClass: 'theme-llt',
        statusText: '微光红外采集链路',
        speedMin: 0,
        speedMax: 5,
    },
    hsi: {
        key: 'hsi',
        type: 'hsi',
        label: 'HSI',
        title: 'HSI数据拍摄处理',
        entryLabel: 'HSI模块',
        themeClass: 'theme-hsi',
        statusText: '高光谱采集链路',
        speedMin: 50,
        speedMax: 100,
    },
};

export const modalList = Object.values(modalConfigs);
