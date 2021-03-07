/*

@Name：不落阁后台模板源码
@Author：Absolutely
@Site：http://www.lyblogs.cn

*/

layui.define(['laypage', 'layer', 'form', 'pagesize', 'common','laydate'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form(),
        laypage = layui.laypage;
    var laypageId = 'pageNav';
    var common = layui.common;//自己封装的ajax
    var name,startTime,endTime;//查询关键字字段
    var page = 0, number = 8;//页数，条数
    var pages;//翻页的数量
    var laydate=layui.laydate;
    laydate.render({
        elem: '#startTime', //指定元素
        done: function(value, date, endDate){
            startTime=value //得到日期生成的值，如：2017-08-18
        }
    });
    laydate.render({
        elem: '#endTime', //指定元素
        done: function(value, date, endDate){
            endTime=value //得到日期生成的值，如：2017-08-18
        }
    });


    initilData(page, number);
    //页数据初始化
    //currentIndex：当前也下标
    //pageSize：页容量（每页显示的条数）
    function initilData(currentIndex, pageSize) {
        var index = layer.load(1);
        var data = new Array();
        //动态获取每日规划数据
        common.ajax(common.onlineIp+'/questionnaire/list', 'post', 'json', {
            // 'userNo': data.field.userNo,
            'pageNum': page,
            'pageSize': number,
            'startTime':startTime,
            'endTime':endTime
        }, function (res) {
            console.log(JSON.stringify(res));
            if (res.code == 200) {
                var list = res.data.list
                pages= Math.ceil(list.length / number);
                for (var i = 0; i < list.length; i++) {
                    data.push({
                        id: list[i].id,
                        userId: list[i].userId,
                        title1: list[i].title1,
                        title2: list[i].title2,
                        title3: list[i].title3,
                        title4: list[i].title4,
                        title5: list[i].title5,
                        title6: list[i].title6,
                        title7: list[i].title7,
                        createTime: list[i].createTime,
                    });
                }
            } else {
                layer.msg(res.msg, {icon: 5});

            }
        });


        //模拟数据加载
        setTimeout(function () {
            layer.close(index);
            //计算总页数（一般由后台返回）
            pages = Math.ceil(data.length / pageSize);
            var html = '';  //由于静态页面，所以只能作字符串拼接，实际使用一般是ajax请求服务器数据
            html += '<table style="" class="layui-table" lay-even>';
            html += '<colgroup></colgroup>';
            html += '<thead><tr><th>编号id</th><th >学生账号</th><th title="你本人或家庭成員是否有被确认，疑似或被隔离的现象">title1</th><th title="当日体温是否正常">title2</th><th title="是否接触过疫情中高风险疫区、境外入境人员，是否接触过确诊或疑似病患">title3</th><th title="是否有跨地区出行情况">title4</th><th title="更新后健康码(苏康码)的颜色">title5</th><th title="今日是否有与重点疫情国家(地区)回国人员(亲戚或人员)接触史">title6</th><th title="有无需要反馈的其他情况?(如乘车外出行为:行程、车次；体温异常等)">title7</th><th>创建时间</th><th  colspan="1">操作</th></tr></thead>';
            html += '<tbody>';
            //遍历文章集合
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                item.title1==0? item.title1="": item.title1='checked'
                item.title2==0? item.title2="": item.title2='checked'
                item.title3==0? item.title3="": item.title3='checked'
                item.title4==0? item.title4="": item.title4='checked'
                item.title5==0? item.title5="": item.title5='checked'
                item.title6==0? item.title6="": item.title6='checked'
                html += "<tr>";
                html += "<td>" + item.id + "</td>";
                html += "<td>" + item.userId + "</td>";
                html += "<td><form class=\"layui-form\" action=\"\"><div class=\"layui-form-item\" style=\"margin:0;\"><input "+item.title1+" type=\"checkbox\" name=\"zzz\" disabled lay-skin=\"switch\"  lay-text=\"有|没有\" ></div></form></td>";
                html += "<td><form class=\"layui-form\" action=\"\"><div class=\"layui-form-item\" style=\"margin:0;\"><input "+item.title2+" type=\"checkbox\" name=\"zzz\"  disabled lay-skin=\"switch\"  lay-text=\"异常|正常\" ></div></form></td>";
                html += "<td><form class=\"layui-form\" action=\"\"><div class=\"layui-form-item\" style=\"margin:0;\"><input "+item.title3+" type=\"checkbox\" name=\"zzz\" disabled lay-skin=\"switch\"  lay-text=\"有|没有\" ></div></form></td>";
                html += "<td><form class=\"layui-form\" action=\"\"><div class=\"layui-form-item\" style=\"margin:0;\"><input "+item.title4+" type=\"checkbox\" name=\"zzz\" disabled lay-skin=\"switch\"   lay-text=\"有|没有\" ></div></form></td>";
                html += "<td><form class=\"layui-form\" action=\"\"><div class=\"layui-form-item\" style=\"margin:0;\"><input "+item.title5+" type=\"checkbox\" name=\"zzz\" disabled lay-skin=\"switch\"  lay-text=\"红色或黄色|绿色\" ></div></form></td>";
                html += "<td><form class=\"layui-form\" action=\"\"><div class=\"layui-form-item\" style=\"margin:0;\"><input "+item.title6S+" type=\"checkbox\" name=\"zzz\" disabled lay-skin=\"switch\"    lay-text=\"有|没有\" ></div></form></td>";
                html += "<td>" + item.title7 + "</td>";
                html += "<td>" + getLocalTime(item.createTime)  + "</td>";
                // html += '<td><button class="layui-btn layui-btn-small layui-btn-normal" onclick="layui.studentDailyPlanning.editData(\'' + item.id + ',' + item.plan + '\')"><i class="layui-icon">&#xe605;</i></button></td>';
                // html += '<td><button class="layui-btn layui-btn-small layui-btn-warm" onclick="layui.studentDailyPlanning.auditData(\'' + item.id + '\')"><i class="layui-icon">&#xe60a;</i></button></td>';
                html += '<td><button class="layui-btn layui-btn-small layui-btn-danger" onclick="layui.theHostelHasSetSailList.deleteData(\'' + item.id + '\')"><i class="layui-icon">&#xe640;</i></button></td>';
                html += "</tr>";
            }
            html += '</tbody>';
            html += '</table>';
            html += '<div id="' + laypageId + '"></div>';

            $('#dataContent').html(html);

            form.render('checkbox');  //重新渲染CheckBox，编辑和添加的时候
            $('#dataConsole,#dataList').attr('style', 'display:block'); //显示FiledBox
            //翻页器
            laypage({
                cont: laypageId,
                pages: pages,
                groups: 8,
                skip: true,
                curr: currentIndex,
                jump: function (obj, first) {
                    page = obj.curr;
                    if (!first) {
                        //重新调用方法
                        initilData(page, number);
                    }
                }
            });
            //该模块是我定义的拓展laypage，增加设置页容量功能
            //laypageId:laypage对象的id同laypage({})里面的cont属性
            //pagesize当前页容量，用于显示当前页容量
            //callback用于设置pagesize确定按钮点击时的回掉函数，返回新的页容量
            layui.pagesize(laypageId, number).callback(function (newPageSize) {
                //这里不能传当前页，因为改变页容量后，当前页很可能没有数据
                number=newPageSize
                initilData(1, number);
            });
        }, 500);
    }
    //搜索 formSearch
    form.on('submit(formSearch)', function (data) {
        initilData(page, number);
        return false;
    })
    //刷新 TheRefresh
    form.on('submit(TheRefresh)', function (data) {
        startTime="",endTime=''
        $("#startTime").val("");
        $("#endTime").val("");
        form.render();
        initilData(page, number);
        return false;
    })
    //时间戳翻译为时间
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
    }

    //添加数据   formulate
    form.on('submit(formulate)', function (data) {
        //创建每日规划模板  dailyPlan
        var index = layer.open({
            title: "制定每日规划",
            type: 2,
            skin: 'layui-layer-rim', //加上边框
            area: ['auto'], //宽高
            maxmin: true, //开启最大化最小化按钮
            shadeClose: true,
            content: "/BlogHtTemplate/html/planning/dailyPlan.html",
        })
        layer.full(index);
        return false;
    })


    //输出接口，主要是两个函数，一个删除一个编辑
    var theHostelHasSetSailList = {
        deleteData: function (id) {
            //删除数据
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                common.ajax(common.onlineIp+'/questionnaire/delete', 'post', 'json', {
                    'id': id,//学生
                }, function (res) {
                    initilData(page, number);
                    //执行重载
                });
            }, function () {

            });
        },
        //审核
        editData: function (data) {
            // layer.msg('编辑Id为【' + id + '】的数据');
            //修改数据
            var id = data.split(",")[0];
            var plan = data.split(",")[1];
            var newHtml = getEditUpadat(id, plan)
            var index = layer.open({
                title: "编辑",
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['480px', '500px'],
                maxmin: true, //开启最大化最小化按钮
                shadeClose: true,
                content: newHtml,
                success: function (layero, index) {

                },
                end: function () {
                    initilData(page, number);
                }
            })
        },
        auditData: function (id) {
            //归档
            console.log("归档")


        }
    };
    //监听修改提交
    form.on('submit(getEditUpadat)', function (data) {
        //获取id 与内容  提交修改
        console.log(data.field);
        common.ajax(common.onlineIp+'/arrangements/check', 'post', 'json', {
            'id': data.field.id,//学生
            'suggest': data.field.suggest,
            //'plan':data.field.plan,//
            //'isCheck':'T',
            //isComplete //是否完成
        }, function (res) {
            console.log(JSON.stringify(res))
            if (res.code == 200) {
                layer.msg("审核通过", {icon: 6, time: 2000}, function () {
                    //关闭弹窗
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.close(index);
                    //执行重载
                    initilData(page, number);
                })
            } else {

            }


        });

        return false;
    })

    //生成修改每日规划的页面
    function getEditUpadat(id, plan) {
        console.log(plan)
        //返回数据
        var strHtml = '        <form lay-filter="formTest" class="layui-form" style="padding-top: 10px">\n' +
            '            <div class="layui-form-item">\n' +
            '                <div class="layui-form-label">每日规划</div>\n' +
            '                <div class="layui-input-block " style="padding-right: 20px;">\n' +
            '                    <textarea name="plan" placeholder="请输入内容" lay-verify="required"  class="layui-textarea">' + plan + '</textarea>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="layui-form-item">\n' +
            '                <div class="layui-form-label">老师建议</div>\n' +
            '                <div class="layui-input-block " style="padding-right: 20px;">\n' +
            '                    <textarea name="suggest" placeholder="请输入内容" lay-verify="required"  class="layui-textarea"></textarea>\n' +
            '                </div>\n' +
            '<div style="display: none"><input name="id"  value="' + id + '"  class="layui-input">\n </div>' +
            '            </div>\n' +
            '            <div class="layui-form-item" style="margin-top:25px;margin-bottom:0;">\n' +
            '                <div class="layui-input-block">\n' +
            '                    <button class="layui-btn" style="width:230px;" lay-submit="" lay-filter="getEditUpadat">审核通过</button>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </form>';
        return strHtml;
    }

    exports('theHostelHasSetSailList', theHostelHasSetSailList);
});

