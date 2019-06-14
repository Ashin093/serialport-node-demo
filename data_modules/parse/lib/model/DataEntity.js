const moment = require('moment');

function DataEntity (tag,value,unit) {
   this.value = value;//数值
   this.timeStamp = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');//时间戳
   this.tag = tag;//co2,nh3,temp
   this.unit = unit;//ppm,C
}

module.exports = DataEntity;