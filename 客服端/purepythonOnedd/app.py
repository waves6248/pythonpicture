# -*- coding: utf-8 -*-
# 项目主入口文件

from flask import Flask
# 跨域引入
from flask_cors import CORS

from main.camera.CallCamera import get_img_from_camera_local

# 实例化app对象
app = Flask(__name__)
CORS(app)

# 测试路由
@app.route('/')
def hello_world():
    return 'Hello World!'


# 调用摄像头并拍照保存
@app.route('/img/photo/', methods=['GET'])
def call_img_from_camera_local():
    return get_img_from_camera_local()

# 调用打印机预览
# 直接打印
# 打印为PDF文件


# 项目入口-主方法
if __name__ == '__main__':
    app.run(host='0.0.0.0',  # 任何IP都可以访问
            port=7777,  # 端口
            debug=True)
