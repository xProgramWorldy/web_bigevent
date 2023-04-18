$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    let y = dt.getFullYear();
    let m = dt.getMonth() + 1;
    let d = dt.getDate();

    let hh = dt.getHours();
    hh = hh < 10 ? "0" + hh : hh;
    let mm = dt.getMinutes();
    mm = mm < 10 ? "0" + mm : mm;
    let ss = dt.getSeconds();
    ss = ss < 10 ? "0" + ss : ss;
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 1. 定义查询的参数对象， 将来请求数据的时候, 需要将请求参数对象提交给服务器
  let rq = {
    pagenum: 1, // 页面值， 默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据， 默认每页显示2条
    cate_id: "", // 文章的分类的id
    state: "", // 文章的发布状态
  };
  initTable();
  initCate();
  // 2. 获取文章列表数据的函数
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: rq,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章列表失败");
        }
        // 使用模板引擎渲染页面的数据
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }

   // 3. 获取文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败');
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-selector', res);
                $('[name="cate_id"]').html(htmlStr);

                // 由于layui本身的机制原因 导致文章类型选项并没有出现下拉的选项内容，但是文章类型已经从服务器获取出来了，所以要使用layui中 render方法， 进行渲染才可以, 通知layui重新渲染表单区域的UI接口。
                form.render();

            }
        })
    }

    // 4. 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $('[name="cate_id"]').val();
        let state = $('[name="state"]').val();
        // 为查询参数对象 rq 中对应的属性赋值
        rq.cate_id = cate_id;
        rq.state = state;
        // 根据最新的筛选条件，重新渲染表格数据
        initTable();
    })

    // 5. 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
       laypage.render({
         elem: 'pageBox', // 分页容器的ID
         count: total,   // 总数据条数
         limit: rq.pagesize, // 每页显示几条数据
         curr: rq.pagenum, //设置默认被选中的分页
         layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
         limits: [2, 3, 5, 10],
        //  分页发生切换的时候，触发 jump回调函数
        // 解决：
        // 触发 jump 回调函数方式有两种：
        // 1. 点击页码的时候， 会触发 jump 回调函数
        // 2. 只要调用了 laypage.render() 就会触发 jump回调函数
         jump: function(obj, first) {
            // 通过obj.curr就能得到当前用户点击的是哪一个分页
            // console.log(obj.curr);
            rq.pagenum = obj.curr;

            // 把最新的的条目数，赋值rq 这个查询参数兑现的 pagesize属性中
            rq.pagesize = obj.limit;

            // 根据用户点击的页码值获取最新对应数据列表，从而渲染表格，但是渲染函数如果写在这个位置上会出现 回调函数触发死循环的问题。如何解决呢?
            // 解决这个问题首先考虑， jump回调函数触发的条件有哪些
            // 只有jump函数不停的触发才会出现这种情况

            // 可以通过 first的值， 来判断是通过哪种方式, 触发的jump回调
            // 如果 first 的值为 true 证明是方式2触发
            // 否则就是方式1 触发的
            if (!first) {
                initTable();
            }
         }
       })
    }

    // 6. 为删除按钮绑定事件， 通过事件委托的形式绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        let btnCount = $('.btn-delete').length;
        
        // /my/article/delete/:id : 这里的冒号是指的是动态参数
        let id = $(this).attr('data-id');
        // 询问用户是否要删除文章
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    // 当数据删除完成后， 需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了， 则让页码值 -1 之后
                    // 再重新调用 initTable 方法
                    if (btnCount === 1) {
                     // 如果btnCount的值等于1， 证明删除完毕之后，页面上就没有任何数据了
                    //  页码值最小必须是1
                     rq.pagenum = rq.pagenum === 1 ? 1 : rq.pagenum -1;
                    }
                    initTable();
                }

            })
            
            layer.close(index);
          });
    })
});
