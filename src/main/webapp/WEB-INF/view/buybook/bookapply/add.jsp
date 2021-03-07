<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ include file="/WEB-INF/view/common/tag.jsp" %>
<html>
<head>
    <title>缺书登记</title>
    <link rel="stylesheet" href="${baseurl}/lib/layui/css/layui.css" media="all">
</head>
<body>
<form class="layui-form" action="" lay-filter="addForm" style="margin-top: 30px">
    <div class="layui-form-item">
            <label class="layui-form-label">书籍名称</label>
            <div class="layui-input-block">
                <input type="text" name="bookName" required lay-verify="bookName|required" autocomplete="off"
                       placeholder="请输入书籍名称"
                       class="layui-input" style="width: 70%">
            </div>
    </div>
    <div class="layui-form-item" style="margin-left: 110px">
        <div class="layui-input-block">
            <butaton class="layui-btn" lay-submit lay-filter="add">立即提交</butaton>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
        </div>
    </div>
</form>
<script src="${baseurl}/lib/layui/layui.js" charset="utf-8"></script>
<script src="${baseurl}/lib/layui_custom/Hlayui.js" charset="utf-8"></script>
<script>
    layui.use(['form', 'jquery', 'element', 'layer', 'laydate','layerCustom'], function () {
        var element = layui.element;
        $ = layui.jquery,
            layer = layui.layer,
            layerCustom = layui.layerCustom,
            laydate = layui.laydate,
            form = layui.form;

        laydate.render({
            elem: '#birthDay'
            , format: 'yyyy-MM-dd'
        });

        form.verify({
            bookName: function (value) {

                var url = BaseUrl + "book/findByBookName";
                var param = {
                    bookName: value
                }
                var returnMsg = '';
                $.ajax({
                    url: url,
                    type: "get",
                    async: false,
                    data: param,
                    dataType: "json",
                    success: function (result) {
                        if (result.success) {
                            if (result.code === 1200) {
                                returnMsg = "不能添加重复的书名";
                            }
                        }
                    }
                });
                if (returnMsg) {
                    return returnMsg;
                }

            },
            price:function (value) {
                if (isNaN(Number(value))) {
                    return "请输入数字";
                }
            }
        });

        form.on('submit(add)', function (data) {
            var url = BaseUrl + "bookRegister/insert";
            //
            $.post(url, data.field, function (result) {
                if (result.success) {
                    layer.msg(result.msg, function () {
                        parent.layer.close(parent.layer.getFrameIndex(window.name));
                    })
                } else {
                    layer.msg(result.msg)
                    return;
                }
            }, 'json');

            return false;
        });
    });
</script>
</body>
</html>