$(function() {
    // 1. 获取用户的基本信息
    getUserInfo();
    let layer = layui.layer;
    // 3. 点击退出，退出到登录界面上
    $('#btnIndexOut').on('click', function() {
        // 利用layui的内置模块中confirm 询问函数，来判断用户是否确认退出
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 当点击确认退出后，此时要做两件事
            // 1. 清空本地存储的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录界面
            location.href = '/login.html';
            // 3. 这句代码一定要带上，这是layui官方提供的
            layer.close(index);
         });
    })
})

//1. 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        // 这个请求接口，是一个有权限的接口。所以要在headers 上添加一些验证字段
        url: '/my/userinfo',
        success: function(res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            renderAvater(res.data);
        },
    })
}

//2. 渲染用户的头像
function renderAvater(dataObj) {
    let uname = dataObj.nickname || dataObj.username;
    $('#welcome').html('欢迎 ' + uname);
    if (dataObj.user_pic !== null) {
        $('.layui-nav-img').attr('src', dataObj.user_pic).show();
        $('.text-avatar').hide();
    } else {
       $('.layui-nav-img').hide();
       $('.text-avatar').html(uname[0].toUpperCase()).show();
    }

}