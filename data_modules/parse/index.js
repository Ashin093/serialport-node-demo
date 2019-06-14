const Parse = require('parse/node');
const logger = require('log4js').getLogger();
// console.log(Parse);
const settings = require('./../../settings');
const user = require('./lib/model/User');
const deviceId = 'LlgwBux2yh';
let parse = {};
let count = 0;
let timer = null;//初始化重登定时器
global.user = {};//初始化全局用户对象
Parse.serverURL = 'http://'+ settings.parse_domain.ip + ':' + settings.parse_domain.port +'/parse';
Parse.initialize(settings.parse_domain.auth.id,settings.parse_domain.auth.key);

// let saveObject = ()=>{
//
// }
//login
// let login = ()=>{
// 	console.log(count)
// 	if(count > 10){
// 		clearTimeout(timer);
// 		return;
// 	}
// 	Parse.User.logIn(settings.parse_domain.user.username,settings.parse_domain.user.pwd+'1').then(data=>{
// 		console.log(data);
// 		global.user = new user(data.id,data.get('mobilePhone'),data.get('username'),data.get('password'),data.get('email'));
// 		console.log(global.user);//objectId,mobilePhone,username,password,email
// 	// console.log(data.get('mobilePhone'))
// 	}).catch((reason)=>{
// 		count++;
// 		console.log('======Login failed======');
// 		console.log(reason);
// 		timer = setTimeout(()=>{login()}, 5000);
// 	})
// }

// let getDeviceAddr = (deviceName,callback)=>{
// 	let table = Parse.Object.extend(deviceName);
// 	let query = new Parse.Query(table);
// 	let device = new Parse.Object('Device');
// 	device.id = deviceId;
// 	query.equalTo('device',device);
// 	query.first().then(data=>{
// 		console.log(data.get('devAddress'));
// 		return data.get('devAddress');
// 	}).catch(reason => {
// 		if(reason) callback(reason);
// 	})
// };

// getDeviceAddr('CO2',function(err){
// 	console.log(err)
// })

// parse['login'] = login;
// parse['getDeviceAddr'] = getDeviceAddr;
module.exports = parse;
// let GameScore = Parse.Object.extend("GameScore");
// console.log(GameScore);
//
// let co2 = Parse.Object.extend("CO2");
// console.log(new co2());
//
// let Device = Parse.Object.extend("Device");
// let query = new Parse.Query(Device);
// query.find().then((data)=>{
// 	console.log('data=======',data)
// 	for(let item of data){
// 		console.log(item.get('co2'))
// 	}
// })
// let query = new Parse.Query(GameScore);
// console.log(query);
// query.equalTo("playerName", "Jack");
// query.find({
//   success: function(results) {
//     console.log("Successfully retrieved " + results.length + " scores.");
//     // Do something with the returned Parse.Object values
//     for (var i = 0; i < results.length; i++) {
//       var object = results[i];
//       console.log(object.id + ' - ' + object.get('playerName'));
//     }
//   },
//   error: function(error) {
//     console.log("Error: " + error.code + " " + error.message);
//   }
// });

// var query = new Parse.Query('GameScore')
//         query.equalTo('playerName','Jack')
//         // query.limit(10000)
//         // var datas={}
//         // var data_a =[]
//         query.find().then((records)=>{

//             for (let item of records) {
//                 console.log(item);
//             }})