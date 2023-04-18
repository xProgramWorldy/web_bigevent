$(function () {
  let layer = layui.layer;
  let form = layui.form;

  initCate();
  initEditor();
  // 1. 定义加载文章分类的函数
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败");
        }
        //   调用模板引擎， 渲染分类的下拉菜单
        let htmlStr = template("tpl-cate", res);
        $('[name="cate_id"]').html(htmlStr);
        // 一定要记得调用 form.render()这样才能正常显示
        form.render();
      },
    });
  }

  //   2. 文章封面裁剪区域
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 3. 为选择封面的按钮， 绑定点击事件处理函数,从而触发打开文件
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  // 4. 监听 coverFile 的 change事件， 获取用户选择的文件列表
  $("#coverFile").on("change", function (e) {
    let files = e.target.files;
    if (files.length === 0) {
      return;
    }
    // 根据用户所选择的文件， 创建对应的 URL地址
    let newImgURL = URL.createObjectURL(files[0]);
    // 为裁剪区域重新设置图片
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //   定义文章的发布状态
  let art_state = "已发布";
  //   5. 为存为草稿按钮，绑定点击事件函数
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  // 6. 为表单绑定submit事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    // 1. 基于 form表单，快速创建一个FormData对象
    let fd = new FormData($(this)[0]);
    // 2. 将文章的发布状态， 存储到fd 中
    fd.append("state", art_state);

    //3. 将封面裁剪过后的图片， 输出为一个对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 4. 将文件的对象存储到 fd 中
        fd.append("cover_img", blob);

        // 5. 发起 Ajax 数据请求
        publishArticle(fd)

      });
  });

//   定义一个发布文章的函数
function publishArticle(fd) {
    $.ajax({
        method: 'POST',
        url: '/my/article/add',
        data: fd,
        //注意： 如果向服务器提交的是FormData 的格式数据，必须添加一下两个配置
        contentType: false,
        processData: false,
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('发布文章失败');
            }
            layer.msg('发布文章成功');
            location.href = '/article/article_list.html';
        } 
    })
}
});
