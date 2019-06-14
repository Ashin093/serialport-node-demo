let settings = require('./../../settings');
let log4js = require('log4js');
let logger = log4js.getLogger();
let deviceId = settings.device.deviceId;
let nh3DeviceId = settings.nh3DeviceId;
let Parse = require('parse/node');
Parse.serverURL = 'http://'+ settings.parse_domain.ip + ':' + settings.parse_domain.port +'/parse';
Parse.initialize(settings.parse_domain.auth.id,settings.parse_domain.auth.key);
let EventProxy = require('eventproxy');
let ep = new EventProxy();
let conmmand = [0x03,0x03,0x00,0x10,0x00,0x01,0x84,0x2D];
let devAddress = 0;
let schedule = require('node-schedule');

//03 03 00 10 00 01 84 2D

function nh3task(serialPort,callback){
    let table = Parse.Object.extend('NH3');
    let query = new Parse.Query(table);
    let device = new Parse.Object('Device');
    device.id = deviceId;
    query.equalTo('device',device);
    query.first().then(data=>{
        console.log(data.get('devAddress'));
        devAddress = data.get('devAddress');
        ep.emit('nh3timer',serialPort);
    }).catch(reason => {
        if(reason) callback(reason);
    })
}

ep.assign('nh3timer',function(serialPort){

    if(devAddress==0){
        console.log('设备地址查询失败');
        return;
    }else{
        conmmand[0]= parseInt(devAddress,16);
        console.log(conmmand);

        global.deviceAddr.nh3 = conmmand[0];
        let cmd = Buffer.from(conmmand);
        console.log('氨气cmd:'+cmd);
        // console.log('serialPort=',serialPort)
        let j = schedule.scheduleJob('5,20,35,50 * * * * ?',function(){//从每分钟的5秒开始，每15秒执行一次
            console.log('this is nh3 scheduleJob',new Date().getSeconds());
            serialPort.write(cmd,function(err,results){
                    if(err){
                        logger.error("write error :",err);
                        callback(err);
                    }
                })
        });
    }
});

let dataFormatter = (data)=>{
    return parseInt(data.toString('hex').substring(6,10),16);
}

let saveObject = (table,ppm)=>{

    let Nh3 = Parse.Object.extend(table);
    let nh3 = new Nh3();

    nh3.set('ppm',parseFloat(parseFloat(ppm).toFixed(1)));
    
    let NH3 = new Parse.Object('NH3');
    NH3.id = nh3DeviceId;
    nh3.set('nh3',NH3);
    nh3.save().then(nh3=>{
        console.log('NH3数据:'+nh3.id+' saved');
        console.log('存储数：',++global.savecount);
        console.log('NH3存储数：',++global.nh3savecount);
    })
};

module.exports = {
    save:saveObject,
    task:nh3task,
    dataFormatter:dataFormatter
};