$(function(){
    var layer = layui.layer;
    var form = layui.form;
    form.verify({
        nickname:function(value){
            if(value.length > 6) {
                return '昵称长度必须1~6位'
            }
        }
    })
    // 初始化用户的基本信息
    initUserInfo();
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败');
                }
                console.log(res);
                form.val('formUserInfo',res.data)
            }
        })
    }
    // 实现表单重置
    $('#btnReset').on('click',function(e){
        e.preventDefault();
        initUserInfo();
    })
    // 监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    layer.msg(res.message);
                }
                layer.msg(res.message);
                // 在子页面中调用父页面的函数
                window.parent.getUserInfo()
            }
        })
    })
})