let log4js = require('log4js');
log4js.configure('./log4js.json');
let settings = require('./settings');
let logger = log4js.getLogger();
let SerialPort = require('serialport');
let co2 = require('./device_modules/co2');
let nh3 = require('./device_modules/nh3');
let tah = require('./device_modules/TempAndHumidity');
let portName = settings.device.portName;
global.receivecount = 0;
global.savecount = 0;
global.co2savecount = 0;
global.nh3savecount = 0;
global.tahsavecount = 0;
global.errorcount = 0;
let cmd = Buffer.from([0x01,0x03,0x00,0x02,0x00,0x01,0x25,0xCA]);//0x01 0x03 0x00 0x02 0x00 0x01 0x25 0xCA
global.deviceAddr = {};
let serialPort = new SerialPort(portName,{
    baudRate : settings.device.baudRate, //波特率
    dataBits : settings.device.dataBits,  //数据位
    parity : settings.device.parity, //奇偶校验
    stopBits : settings.device.stopBits, //停止位
    flowControl : false,
    autoOpen:false
},false);

serialPort.open(function(err){
    console.log('IsOpen:',serialPort.isOpen);
    console.log('IsOpening:',serialPort.opening);
    logger.info('IsOpen:',serialPort.isOpen);
    logger.info('IsOpening:',serialPort.opening);
    // console.log(serialPort.list)
    console.log('err:',err)
    if(err){
        console.log(portName+'端口打开失败：'+err);
    }else{
        console.log(portName+'端口打开成功，正在监听数据');
    }
})

serialPort.on('data',(data)=>{
    console.log('收到数据数：',++global.receivecount);
    let addr = data.toString('hex').substring(0,2);
    console.log('addr===>',addr);
    console.log('data===>',data);

    switch(parseInt(addr)){
        case parseInt(deviceAddr.tah):
            tah.save('TempAndHumidityRecord', tah.dataFormatter(data).temp, tah.dataFormatter(data).humidity);
            break;
        case parseInt(deviceAddr.co2):
            co2.save('CO2Record',co2.dataFormatter(data));
            break;
        case parseInt(deviceAddr.nh3):
            nh3.save('NH3Record',nh3.dataFormatter(data));
            break;
        default:
            console.log('查询地址异常：',addr);
            console.log('数据异常数：',++errorcount);
            logger.info('数据异常数：',++errorcount);
            logger.info('异常返回:'+data);
            logger.info('异常地址['+ errorcount +']:'+addr);
            break;
    }
});

// 启动二氧化碳数据采集模块
    co2.task(serialPort,(err)=>{
        if(err)logger.error('co2模块启动失败：'+err);
        return;
    });


    nh3.task(serialPort,(err)=>{
        if(err)logger.error('nh3模块启动失败：'+ err);
        return;
    });

    tah.task(serialPort,(err)=>{
        if(err)logger.error('tah模块启动失败：'+ err);
        return;
    });