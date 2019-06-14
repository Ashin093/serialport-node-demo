const EventProxy = require('eventproxy');
let ep = new EventProxy();
let flag = 1;
let sleep = function (delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(1)
            } catch (e) {
                reject(0)
            }
        }, delay);
    })
}
ep.tail('step1',function () {
    console.log('step1 complete')
})

ep.tail('step2',()=>{
    console.log('step2 complete');
})

setInterval(function () {
    console.log(flag);
    ep.emit('step'+(flag++));
    if(flag >2 ){
        flag = 1;
    }
},1000)