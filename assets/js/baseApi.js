/**ajaxPrefilter()解析
 * 1. 注意： 每次调用jQuery里面的 $.get() 或 $.post() 或 $.ajax() 的时候，
 * 2. 都会先执行调用 ajaxPrefilter() 这个函数
 * 3. 这个函数执行的时候， 可以获取到我们给Ajax提供的配置对象(options)
 * 4. 所以只有这个函数执行执行完毕后，才会发起真正的请求,
 * 5. 所以在利用这个函数的特性， 在发器真正的请求的时候，我们可以拼接URL等等
 */

$.ajaxPrefilter(function (options) {
  // 在发起真正的 Ajax 请求之前，进行统一拼接请求的根路径
  options.url = "http://www.liulongbin.top:3007" + options.url;

  // 统一为有权限的接口，设置 headers 请求头
  // 通过indexOf 查找有没有 /my/这个字符串，
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }

  // 全局统一挂载 complete 回调函数  控制用户的访问权限
 //   complete: 不论成功还是失败， 最终都会调用 complete 回调函数
  options.complete = function (res) {
    // console.log('执行了complete回调函数');
    // console.log(res);
    // complete 回调函数中 可以使用 responseJSON 拿到服务响应回来的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 1. 强制清空 token
      localStorage.removeItem("token");
      //2. 强制跳转到登录页面
      location.href = "/login.html";
    }
  };
});
