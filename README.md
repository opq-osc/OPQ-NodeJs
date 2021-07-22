# OPQ-NodeJs
## 开始

1.首先的有node环境，没有的先[安装](https://xjlz.github.io/2020/08/10/Centos7%E5%AE%89%E8%A3%85Node+Npm/)。  
2.有环境了，先 **npm install --unsafe-perm=true --allow-root**把依赖下载下来。  
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

**创建软连接**

![image-20210720203252672](https://i.loli.net/2021/07/20/QNfpk4i92GeVdlI.png)



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

# 部分字体
yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
```

更多插件等你来发掘。。。。

## 开发

在Plugins文件中，按照例子进行开发即可。。。。

## 遇到的问题

- 安装puppeteer，无法创建文件夹，使用 **npm install --unsafe-perm=true --allow-root**

![image-20210721093306068.png](https://i.loli.net/2021/07/21/1SU4FDh9LnIP6vK.png)

- 使用puppeteer截图，发现有些字无法显示，centos7系统内置可能没有中文字体

  ```
  1、查看所有字体：（如果提示 fc-list: command not found，则需要安装# yum -y install fontconfig）
  	fc-list
  2、查看中文字体：
  	fc-list :lang=zh
  3、找到win10的字体，并使用工具上传到服务器上：
      C:\Windows\Fonts\msyh.ttc  (微软雅黑)
      C:\Windows\Fonts\simfang.ttf  (仿宋)
  4、复制到/usr/share/fonts/
  	cp msyh.ttc simfang.ttf /usr/share/fonts/
  5、建立字体索引信息，更新字体缓存
  	cd /usr/share/fonts/
  	mkfontscale //如果提示 mkfontscale: command not found，需自行安装 # yum -y install mkfontscale 
  	mkfontdir
  	fc-cache //如果提示 fc-cache: command not found，则需要安装# yum -y install fontconfig
  6、查看中文字体是否安装成功
  	fc-list :lang=zh
  /usr/share/fonts/msyh.ttc: Microsoft YaHei:style=Normal
  /usr/share/fonts/msyh.ttc: Microsoft YaHei UI:style=Normal
  /usr/share/fonts/simfang.ttf: FangSong:style=Regular,Normaali
  ```

  

![image-20210721095246350](https://i.loli.net/2021/07/21/dMebXDctwSZk8Nx.png)



## 相关文章

❤️以下文章或项目排名不分先后 🙏感谢贡献 ❤️

- **😄 [实现一个“人工智能”QQ机器人！](https://segmentfault.com/a/1190000021259760)**
- **😄 [实现一个“人工智能”QQ机器人！续](https://segmentfault.com/a/1190000021350469)**
