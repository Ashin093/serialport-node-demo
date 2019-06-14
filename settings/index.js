const settings = {
    device : {
        baudRate : 9600, //波特率
        dataBits : 8,  //数据位
        parity : 'none', //奇偶校验
        stopBits : 1, //停止位
        portName:"COM5",
        deviceId:'LlgwBux2yh'
    },
    cmd : {
        co2:[0x01,0x03,0x00,0x02,0x00,0x01,0x25,0xCA],//设备地址默认为1 第一位0x01标识设备地址
        nh3:[0x03,0x03,0x00,0x10,0x00,0x01,0x84,0x2D],//设备地址默认为3
        temp:[0x02]//设备地址默认为2
    },
    interval_time:"10000",//读取数据频率 2秒一次
    log4j:{
        filePath:"D:\\Code\\logs\\dataCollector"
    },
    parse_domain:{
        ip:'10.4.23.12',
        port:'1337',
        auth:{
            id:'testid',
            key:'testjskey'
        },
        user:{
            username:'csh',
            pwd:'1q2w3e4r'
        }
    },
    co2DeviceId:'aCcxkBpHm9',
    nh3DeviceId:'7WSsARHDZi',
    tahDeviceId:'6Pc7Y7rpJQ'
}

module.exports = settings;