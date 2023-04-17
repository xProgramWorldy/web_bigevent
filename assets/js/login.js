$(function() {
    // 1. 登录/注册界面互相切换
    $('#link_reg').on('click', function() {
        // (1) 这是css样式隐藏
        // $('.login-box').css("display", "none");
        // (2) 这是函数内部的封装的隐藏，这个更好
        $('.login-box').hide();
        // $('.reg-box').css("display", "block");
        $('.reg-box').show();
    })
    $('#link_login').on("click", function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 2. 通过layui框架， 来自定义一些自己表单验证
    // 因为使用的是layui的js插件，该插件封装了layui对象，就像jQuery对象封装了 $一样，都是一个意思
      let form = layui.form;
      
    //   通过form.verify()函数自定义校验规则
      form.verify({
        // 然后将这个自定义的校验规pwd放在lay-verify="required|pwd" 这里即可
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
       
        // 这里value是表单的值， layui会自己获取表单内部的值
        repwd: function(value) {
         let pwd =  $('.reg-box [name=password]').val();
         if (pwd != value) {
            return '用户两次密码不一致' ;
         }
        }
      })

      // 3. 监听注册表单的提交事件
      let layer = layui.layer;
      $('#form_reg').on('submit', function(e) {
          e.preventDefault();
          let uname = $('.reg-box [name=username]').val();
          let pwd = $('.reg-box [name=password]').val();
          $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: uname,
                password: pwd
            },
            success: function(res) {
               if (res.status != 0) {
                //  return console.log(res.message);
                console.log(res.message);
                return layer.msg("注册失败");
               }
               layer.msg('注册成功，请登录!');
               $('#link_login').click();
            }
          })
      })

      // 4. 监听登录表单的提交事件
      $('#form_login').submit(function(e) {
         e.preventDefault();
         $.ajax({
            method: 'POST',
            url: '/api/login',
            // 这个是jQuery中快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
               if (res.status != 0) {
                console.log(res);
                 return layer.msg("登录失败");
               }
               layer.msg("登录成功");

            // 将登录成功得到的 token 字符串， 保存到 localStorage 电脑本地中
            localStorage.setItem('token', res.token);

              //  跳转到后台主页
              location.href = '/index.html';
            }
         })

      })
   
})