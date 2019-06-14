/**
 * 计算cron表达式测试模块
 * @type {Array}
 */
let sed = [];
for (var i = 0; i < 60; i++) {
    sed[i] = i;
}
let flag = 0;
let co2 = [];
let nh3 = [];
let temp = [];
for(item of sed){
    console.log(item);
    if(item%5==0){
        if(flag == 0 ){co2.push(item)}
        if(flag == 1){nh3.push(item)}
        if(flag == 2){temp.push(item)}
        flag+=1;
        if(flag>=3)flag =0;
    }
}
console.log(co2)
console.log(nh3)
console.log(temp)