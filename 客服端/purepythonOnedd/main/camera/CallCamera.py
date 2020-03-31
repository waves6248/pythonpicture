# -*- coding: utf-8 -*-
# 调用摄像头文件
import base64
import cv2, json, urllib2

from flask import Flask
from poster.encode import multipart_encode
from poster.streaminghttp import register_openers

import configparser
import os

root_dir = os.path.dirname(os.path.abspath('.'))  # 获取当前文件所在目录的上一级目录，即项目所在目录D:\study\pythons
cf = configparser.ConfigParser()
cf.read(root_dir + "/purepythonOnedd/main/config.ini")  # 拼接得到config.ini文件的路径，直接使用
# secs = cf.sections()  # 获取文件中所有的section(一个配置文件中可以有多个配置，如数据库相关的配置，邮箱相关的配置，每个section由[]包裹，即[section])，并以列表的形式返回
path = cf.get("Camera", "filepath")  # 获取[Camera]中filepath对应的值
url_config = cf.get("Camera", "upload_url")  # 获取[Camera]中upload_url对应的值

# 调用摄像头拍照具体处理方法
def get_img_from_camera_local():
    folder_path = path
    file_path = ""
    i = 1
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        cv2.imshow("capture", frame)
        print str(i)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            file_path = folder_path + "test" + str(i) + '.png'
            cv2.imwrite(file_path, frame)  # 存储为图像
            break
        i += 1
    cap.release()
    cv2.destroyAllWindows()

    # 这一步是给前端的数据
    b64_code = ret_base64_data(file_path)

    # 这一步是发送给后台的数据
    upload_file(file_path)

    data = {"code":0,"message":"","data":{"data":b64_code,"filepath":file_path}}
    return data


# 将图片数据转化为base64格式
def ret_base64_data(file_path):
    img = cv2.imread(file_path)
    img_str = cv2.imencode('.png', img)[1].tostring()  # 将图片编码成流数据，放到内存缓存中，然后转化成string格式
    b64_code = base64.b64encode(img_str)  # 编码成base64
    return b64_code


# 上传文件到远程服务器
def upload_file(file_path):
    url = url_config
    register_openers()
    datagen, headers = multipart_encode({"uploadFile": open(file_path, "rb")})
    request = urllib2.Request(url, datagen, headers)
    response = urllib2.urlopen(request)
    print response.read()
