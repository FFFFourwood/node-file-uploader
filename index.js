
const express = require('express')
const fs = require('fs');
const app = express();
const host = "api.example.com"

// 监听3000端口
var server = app.listen(54300, '127.0.0.1', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server running at http://%s:%s", host, port);
})

// 工具库 - lodash
const _ = require('lodash');
// assert - 测试是否为真值
const { ok } = require('assert');
// crypto - 用于获取文件名 MD5 值
const crypto = require('crypto');
// path - 用于获取文件拓展名
var path = require('path');

// 使用 express-fileupload 中间件
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true
}));

// 处理跨域问题 - cors 模块
const cors = require('cors');
app.use(cors());

// 解析 POST 数据
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 使用 morgan 中间件 - 输出请求详细信息
const morgan = require('morgan');
app.use(morgan('dev'));

app.post('/api/post', async (req, res) => {
    try {
        // 如果没有文件被上传，则返回以下 JSON 数据
        if (!req.files) {
            res.send({
                status: "No file uploaded",
                link: "undefined"
            })
        }
        else {
            let avatar = req.files.avatar; // 声明字段名为 avatar 的图片数据为 avatar 变量
            let now = new Date();
            let year = now.getFullYear().toString();
            let month = (now.getMonth() + 1).toString().padStart(2, '0');
            let md5 = crypto.createHash('md5').update(avatar.name).digest('hex'); // 取 avatar 文件名的 MD5 值
            avatar.mv('/uploads/' + year + '/' + month + '/' + md5 + path.extname(avatar.name)); // 存储(移动)图片到 uploads 文件夹，文件名为 avatar 文件名 MD5 + 文件拓展名
            // 发送以下 JSON 数据
            res.send({
                status: "ok",
                link: host + "/uploads/" + year + "/" + month + "/" + md5 + path.extname(avatar.name)
            });
        }
    }
    // 如果上传出现错误，则返回 HTTP 500.
    catch (err) {
        res.status(500).send(err);
    }
})