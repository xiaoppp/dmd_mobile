angular.module('starter.filters',[])

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
        else return '进行中...'
    }
})

.filter('suborderstate',function() {
    
})