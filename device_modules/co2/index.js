let settings = require('./../../settings');
let log4js = require('log4js');
let Parse = require('parse/node');
let logger = log4js.getLogger();
let deviceId = settings.device.deviceId;
let co2DeviceId = settings.co2DeviceId;
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let devAddress = 0;
let conmmand = [0x02,0x03,0x00,0x02,0x00,0x01,0x25,0xCA];
let schedule = require('node-schedule');
//0x01 0x03 0x00 0x02 0x00 0x01 0x25 0xCA



function co2task(serialPort,callback){
    let table = Parse.Object.extend('CO2');
    let query = new Parse.Query(table);
    let device = new Parse.Object('Device');
    device.id = deviceId;
    query.equalTo('device',device);query.first().then(data=>{
        console.log(data.get('devAddress'));
        devAddress = data.get('devAddress');
        ep.emit('co2timer',serialPort);
    }).catch(reason => {
        if(reason) callback(reason);
    })
}

ep.assign('co2timer',function(serialPort){
    // console.log('1111111111111',serialPort.write);
    if(devAddress==0){
        console.log('设备地址查询失败');
        return;
    }else{
        conmmand[0]= parseInt(devAddress,16);
        global.deviceAddr.co2 = conmmand[0];
        let cmd = Buffer.from(conmmand);
        console.log('co2 cmd：'+cmd);
        // setInterval(function(){
        //     console.log(1)
        //     serialPort.write(cmd,function(err,results){
        //         if(err){
        //             logger.error("write error :",err);
        //             callback(err);
        //         }
        //     })
        // },settings.interval_time)
        let j = schedule.scheduleJob('0,15,30,45 * * * * ?',function(){//从每分钟的0秒开始，每15秒执行一次
            console.log('this is co2 scheduleJob',new Date().getSeconds());
            serialPort.write(cmd,function(err,results){
                    if(err){
                        logger.error("write error :",err);
                        callback(err);
                    }
                })
        });
    }
});

let dataFormatter = function(data){
    return parseInt(data.toString('hex').substring(6,10),16);
}

let saveObject = (table,ppm)=>{
    console.log('存储数：',++global.savecount);
    let Co2 = Parse.Object.extend(table);
    let co2 = new Co2();

    co2.set('ppm',parseFloat(parseFloat(ppm).toFixed(1)));
    
    let CO2 = new Parse.Object('CO2');
    CO2.id = co2DeviceId;
    co2.set('co2',CO2);
    co2.save().then(co2=>{
        console.log('CO2：'+co2.id+' saved');
        console.log('存储数：',++global.savecount);
        console.log('CO2数据存储数：',++global.co2savecount);
    })
};

module.exports = {
    save:saveObject,
    task : co2task,
    dataFormatter:dataFormatter
};

