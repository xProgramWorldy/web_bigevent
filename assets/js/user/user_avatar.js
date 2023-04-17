$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  let $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比:如果是16/9是长方形
    // 这个1就是等边的正方形
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };

  // 1.3 创建裁剪区域
  $image.cropper(options);

  // 2. 为上传按钮绑定点击事件
  $("#btnChooseImage").on("click", function () {
    $("#file").click();
  });

  //3. 为选择框绑定 change 事件
  // 通过这个事件拿到用户的选择的文件
  $("#file").on("change", function (e) {
    //  console.log(e);
    // 通过e.target.files 获取用户选择的文件
    let fileList = e.target.files;
    // console.log(fileList);
    if (fileList.length === 0) {
      return layui.layer.msg("请选择图片");
    }

    // 3.1 首先要拿到用户选择的文件
    let file = e.target.files[0];

    //3.2 将文件转换为路径
    // createObjectURL() 这是一个静态方法,静态方式是由构造函本身调用，而实例方法是由实例对象调用
    // 所以URL是一个是构造函数
    let imgURL = URL.createObjectURL(file);

    // 3.3 重新初始化裁剪区域
    $image
    .cropper("destroy") // 销毁旧的裁剪区域
    .attr("src", imgURL) // 重新设置图片的路径
    .cropper(options);  // 重新初始化裁剪区域
  });

  // 4. 为确定按钮，绑定点击事件
  $('#btnUpload').on('click', function() {
     // 4.1 首先拿到用户裁剪之后的头像
    //  DataURI 允许在HTML文档中嵌入小文件，可以使用 img 标签或 CSS 嵌入转换后的 Base64 编码，减少 HTTP 请求，加快小图像的加载时间。经过Base64 编码后的文件体积一般比源文件大 30% 左右。
    //  转换base64：它适合小图片的进行转换成base64，大图片不能使用base64。
     let dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

      // 4.2 调用接口， 把头像上传到服务器上
      $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {avatar: dataURL},
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('更换头像失败');
            }
            layui.layer.msg('更换头像成功');
            window.parent.getUserInfo();
        }
      })
  })
});
