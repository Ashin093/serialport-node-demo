const CRC = require('./lib/CRC16Modbus');

module.exports = {
    CRC16Modbus : function(str){
        return CRC.ToModbusCRC16(str);
    }
}

