# OPQ-NodeJs
## 开始

1.首先的有node环境，没有的先[安装](https://xjlz.github.io/2020/08/10/Centos7%E5%AE%89%E8%A3%85Node+Npm/)。  
2.有环境了，先 npm install 把依赖下载下来。  
3.由于订阅功能使用到mongodb数据库，需要先[安装](https://xjlz.github.io/2020/08/10/MongoDB/)  
4.最后记得在config.json文件中填写相关配置  

```
{
	"QQ": 23333333,
	"HOST": "127.0.0.1",
	"PORT": 9720,
	"URI": "/v1/LuaApiCaller?",
	"PATTERN": "来(.*?)[点丶份张幅](.*?)的?(|r18)[色瑟涩插][画图圖]",
	"MONGODBURL": "mongodb://127.0.0.1:27017/Bilibili" (没有账号)
	"MONGODBURL": "mongodb://root:root@127.0.0.1:27017:27017/Bilibili" (有账号)
}

```

## 安装PM2

```
npm install pm2 -g
```



## 启动

在经过上述配置无误后就可以启动啦，进入opq.js所在目录，使用pm2启动

```
pm2 start opq.js
```

查看应用列表

```
pm2 list
```

查看日志

```
pm2 logs
```

重启、停止、删除应用，只需要用对应命令加id即可

![image-20210621153503710](https://i.loli.net/2021/06/21/Gm7l4EoPMax58su.png)

```
pm2 restart 8
pm2 stop 8
pm2 del 8
```

## 功能
#### 哔哩哔哩up主订阅

------

可进行up搜索，订阅，取消订阅，第一时间（伪）获取最新视频

#### 原神资讯

------

第一时间（伪）获取最新原神最新活动

#### 历史上的今天

#### 百度百科

#### 星座运势

#### 台风路径

​	**关于puppeteer**

```
centos7 使用puppeteer需要的依赖：
#依赖库
yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y

#字体
yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

Centos7 安装中文字体： https://blog.csdn.net/liuwenbiao1203/article/details/100096031
```

更多插件等你来发掘。。。。

## 开发

在Plugins文件中，按照例子进行开发即可。。。。

## 相关文章

❤️以下文章或项目排名不分先后 🙏感谢贡献 ❤️

- **😄 [实现一个“人工智能”QQ机器人！](https://segmentfault.com/a/1190000021259760)**
- **😄 [实现一个“人工智能”QQ机器人！续](https://segmentfault.com/a/1190000021350469)**
