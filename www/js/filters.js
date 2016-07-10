angular.module('starter.filters', ['starter.constants','starter.services'])

.filter('datetime',function(){
    return function(input){
        if(!input) return '暂无'
        return moment.unix(input).format('YYYY-MM-DD HH:mm:ss')
    };
})

.filter('range',function(){
    return function(input){
        if(input<1) return [];
        var res = new Array(input);
        for(var i=0; i<input; i++) res[i] = i;
        return res;
    };
})

.filter('orderstate',function(){
    return function(input){
        if(input == 100) return '已完成';
        else return '进行中...';
    };
})

.filter('suborderstate',function() {
    return function(input){
        switch (input) {
            case 0:
                return '已取消';                
            case 1:
                return '等待配对';
            case 2:
                return '配对成功，待打款';
            case 3:
                return '打款成功，待收款';
            case 4:
                return '订单已完成';
            default:
                return '未知状态';
        }
    };
})

.filter('duration',function(Utils){
    return function(input){
        return Utils.duration(input);
    };
})

.filter('bank',function(banks){
    return function(input){
        var l = banks.length;
        for(var i = 0; i< l; i++){
            if(banks[i].value == input) 
                return banks[i].text;
        }
        return '未知';
    };
})