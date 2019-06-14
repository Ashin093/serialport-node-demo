// const EventProxy = require('eventproxy');
// let ep = new EventProxy();
// let data = {
// 	name : 'jack',
// 	age : 15
// }

// function start(){
// 	console.log('start试行完毕');
// 	ep.emit('timer',data);
// }

// ep.assign('timer',function(data){
// 	console.log(data.name);
// })

// // start();
// let i = 1;
// let j = 1;
// console.log(i++);
// console.log(++j);

let sed = [];
for (var i = 0; i < 60; i++) {
	sed[i] = i;
}
let flag = 0;
let co2 = [];
let nh3 = [];
let temp = [];
for(item of sed){
	// console.log(item);
	if(item%5==0){
		if(flag == 0 ){co2.push(item)}
		if(flag == 1){nh3.push(item)}
		if(flag == 2){temp.push(item)}
		flag+=1;
		if(flag>=3)flag =0;
	}
}
console.log('co2:',co2)
console.log('nh3:',nh3)
console.log('tah:',temp)