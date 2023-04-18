
$(function() {
    let layer = layui.layer;
    let form  = layui.form;
    initArticleList()
    // 1. 获取文章的分类的列表
    function initArticleList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败');
                }
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

            }
        })
    }

    // 2. 为添加按钮绑定点击事件
    let indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
          })
    })

    // 3. 通过事件委托的形式进行绑定事件
    // 绑定事件： 是绑定页面上已经存在的元素，进行绑定的，
    // 不存在的是绑定了， 此时就可以使用事件委托形式进行绑定
    $('body').on('submit', '#form-add', function(e) {
         e.preventDefault();
         $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                initArticleList();
                layer.msg('新增分类成功');
                // 根据layer.open()返回的索引值，进行关闭弹出层
                layer.close(indexAdd);
            }
         })
    } )

    // 4. 通过事件委托的形式， 为文章编辑 按钮绑定点击事件
    let indexEdit = null;
    $('tbody').on('click', '#btn-edit', function() {
        // 4.1 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
          })

        // 4.2  获取文章中ID信息，通过id信息发送给服务器
          let id = $(this).attr('data-id');
        // 4.3 发起 Ajax 请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res);
            }
        })
    })

    // 5. 修改文章分类的表单是动态创建的,所以要通过事件委托的形式绑定事件
    $('body').on('submit', '#form-edit', function(e) {
         e.prevnetDefault();
         $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败');
                }
                initArticleList();
                layer.close(indexEdit)
                layer.msg('更新分类数据成功');
            }
         })
    })

    // 6. 通过事件委托的形式，绑定删除按钮事件
    $('tbody').on('click', '#btn-delete', function() {
         let id = $(this).attr('data-id');
        //  6.1 提示用户是否删除文章
         layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
           $.ajax({
             method: 'GET',
             url: '/my/article/deletecate/' + id,
             success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('删除文章分类失败');
                }
                layer.msg('删除文章分类成功');
                layer.close(index);
                initArticleList();
             }
           })
          });
    })
})