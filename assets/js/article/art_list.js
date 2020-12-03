$(function () {
    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    // 定义时间补零函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    initTable();
    initCate();
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message);
                }
                // 使用模板引擎渲染页面
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败');
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name="cate_id"]').html(htmlStr);
                // 重新渲染表单区域的ui结构
                form.render();
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的选中项的值
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    // 定义渲染分页方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 8, 10],
            jump: function (obj, first) {
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })

    }
    // 通过代理的形式，为删除按钮绑定事件委托
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        console.log(len);
        var id = $(this).attr('data-id');
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        console.log(q.pagenum);
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })

})