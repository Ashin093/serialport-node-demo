let settings = require('./../../settings');
let log4js = require('log4js');
let logger = log4js.getLogger();
let CRC = require('./../crcUtil');
let parse = require('./../../data_modules/parse');
let Parse = require('parse/node');
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let conmmand = [0x02,0x03,0x00,0x00,0x00,0x02];

let deviceId = settings.device.deviceId;
let tahDeviceId = settings.tahDeviceId;
let devAddress = 0;
let schedule = require('node-schedule');

let crcRun=()=>{
    let cmd = Buffer.from(conmmand);//02 03 00 00 00 02 C4 38
    let crcCmd = cmd.toString('hex');
    // console.log(crcCmd);
    let crcResult = CRC.CRC16Modbus(crcCmd);
    conmmand.push(parseInt(crcResult.substring(0,2),16));
    conmmand.push(parseInt(crcResult.substring(2,4),16));
    return Buffer.from(conmmand);
};



function tah(serialPort,callback){
	// let cmd_ = crcRun();
    // let table = Parse.Object.extend('TempAndHumidity');
    // let query = new Parse.Query(table);
    // let device = new Parse.Object('Device');
    // device.id = deviceId;
    // query.equalTo('device',device);
    // query.first().then(data=>{
    //     console.log(data.get('devAddress'));
    //     devAddress = data.get('devAddress');
    //     ep.emit('tahtimer',serialPort);
    // }).catch(reason => {
    //     if(reason) callback(reason);
    // })
    let table = Parse.Object.extend('TempAndHumidity');
    let query = new Parse.Query(table);
    query.equalTo('objectId',tahDeviceId);
    query.first().then(data=>{
        console.log(data.get('devAddress'));
        devAddress = data.get('devAddress');
        ep.emit('tahtimer',serialPort);
    }).catch(reason => {
        if(reason) callback(reason);
    })

}

ep.assign('tahtimer',function (serialPort) {
    if(devAddress == 0){
        console.log('设备地址查询失败');
        return;
    }else{
        conmmand[0] = parseInt(devAddress,16);
        global.deviceAddr.tah = conmmand[0];
        let cmd_ = crcRun();
        console.log('tah==>',cmd_);
        let j = schedule.scheduleJob('10,25,40,55 * * * * ?',function(){//从每分钟的10秒开始，每15秒执行一次
            console.log('this is tah scheduleJob',new Date().getSeconds());
            serialPort.write(cmd_,function(err,results){
                    if(err){
                        logger.error("write error :",err);
                        callback(err);
                    }
                })
        });
    }

});

let saveObject = (table,temp,hum)=>{
    let Tah = Parse.Object.extend(table);
    let tah = new Tah();

    tah.set('temp',parseFloat(parseFloat(temp).toFixed(1)));
    tah.set('humidity',parseFloat(parseFloat(hum).toFixed(1)));
    let TempAndHumidity = new Parse.Object('TempAndHumidity');
    TempAndHumidity.id = tahDeviceId;
    tah.set('TempAndHumidity',TempAndHumidity);
    tah.save().then(tah=>{
        console.log('温湿度：'+tah.id+' saved');
        console.log('存储数：',++global.savecount);
        console.log('温湿度数据存储数：',++global.tahsavecount);
    })
};

function dataFormatter(buffer){
    let bufferStr = buffer.toString('hex');
    let humidity = parseInt(buffer.toString('hex').substring(6,10),16)/10;
    let temp = parseInt(buffer.toString('hex').substring(10,14),16)/10;
    humidity = humidity.toFixed(1);
    temp = temp.toFixed(1);
    return {humidity:humidity,temp:temp};
}

module.exports = {
    task:tah,
    dataFormatter:dataFormatter,
    save:saveObject
};