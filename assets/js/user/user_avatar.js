$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    //   为上传按钮添加点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })
    // 实现裁剪区域的替换
    $('#file').on('change', function (e) {
        console.log(e);
        var FileList = e.target.files;
        // console.log(FileList);
        if (FileList.length === 0) {
            return '请选择照片';
        }
        // 拿到用户选择的照片
        var file = FileList[0]
        console.log(file);
        // 将文件转化为路径
        var imgURL = URL.createObjectURL(file);
        console.log(imgURL);
        $image.cropper('destroy').attr('src', imgURL).cropper(options);
    })
    // 为确定按钮绑定点击事件
    $('#btnUpload').on('click', function (e) {
        e.preventDefault();
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                //   console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新头像失败');
                }
                layer.msg(res.message);
                window.parent.getUserInfo();
            }

        })
    })
})