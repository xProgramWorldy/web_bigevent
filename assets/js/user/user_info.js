$(function() {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function(value) {
        if (value.length > 6) {
            return '昵称长度必须在 1-6字符之间';
        }
    }
  })
  initUserInfo();
 // 初始化用户的基本信息
 function initUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败');
            }
            // 调用layui库里的 form.val() 快速为表单赋值
            form.val('formUserInfo', res.data);
        }
    })
 }

//   重置表单的数据
 $('#btnReset').on('click', function(e) {
    e.preventDefault();
    initUserInfo();
 })

//  监听表单的提交事件
$('.layui-form').on('submit', function(e) {
    e.preventDefault();
    // 发起 Ajax 数据请求
    $.ajax({
        method: 'POST',
        url: '/my/userinfo',
        // 快速获取表单数据
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('更新用户信息失败');
            }
            layer.msg('更新用户信息成功');
            
            // 调用父页面的方法， 重新渲染用户的头像和用户信息
            // 在子页面里面调用父页面的方法，可以是如下写法：
            window.parent.getUserInfo();
        } 
    })
})

})