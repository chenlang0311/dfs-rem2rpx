# dfs-rem2rpx
[English](./README.md) | 简体中文

将一个样式表中的rem单位转化为rpx

版本: **1.2.1**
### 注意 
    在1.*版本只支持编译css,less,scss文件

### 安装

    运行 npm install dfs-rem2rpx -g
    如果你想编译less文件，你必须先全局安装less
    运行 npm install less -g
    如果你想编译scss文件，你必须先全局安装 node-sass
    运行 npm install node-sass -g

### 用法

```
rem2rpx -o build a.css  或者 rem2rpx -o build a.less  或者 rem2rpx -o build a.scss

参数:
-u, --rpxUnit :设置rem转rpx单位的比例，默认100
-r, --rpxVersion :是否去编译rpx版本，默认为真
-p, --rpxPrecision :rpx单位的精度，默认保存6位
-o, --output [path] : 输出文件的目录 
```

### 资源示例


```
.a {
  width: 1rem;
  height: .1rem;
  line-height: 0.1rem;
  border: 1px solid red;
}
.b{
  width: 1rem;/*no*/
  padding: .2rem .4rem 0 0.4rem;
}
@keyframes mymove
{
from {top:0px;}
to {top:2rem;}
}
@media screen and (max-width: 300px) {
  body {
     width: 3rem;
     height: 1rem;/*no*/
  }
}
```

#### 输出文件  build/a.rpx.css

```
.a {
  width: 100rpx;
  height: 10rpx;
  line-height: 10rpx;
  border: 1px solid red;
}

.b {
  width: 1rem;
  padding: 20rpx 40rpx 0 40rpx;
}

@keyframes mymove {
  from {
    top: 0px;
  }

  to {
    top: 200rpx;
  }
}

@media screen and (max-width: 300px) {
  body {
    width: 300rpx;
    height: 1rem;
  }
}
```
