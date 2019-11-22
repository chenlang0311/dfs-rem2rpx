# dfs-rem2rpx
English | [简体中文](./README-cn.md)

According to one stylesheet,make the rem to rpx

Version: **1.2.2**
### Notice
    The version in 1.* is just support the file of css and less and scss

### install

    Run npm install dfs-rem2rpx -g
    if you want to compile less file you must install the less
    Run npm install less -g
    if you want to compile scss file you must install the node-sass
    Run npm install node-sass -g

### Usage css file

```
rem2rpx -o build a.css  or rem2rpx -o build a.less  or rem2rpx -o build a.scss

options:
-u, --rpxUnit :set `rpx` unit value (default: 100)'
-r, --rpxVersion :whether to generate rpx version stylesheet (default: true)
-p, --rpxPrecision :set rpx value precision (default: 6)', 6)
-o, --output [path]', 'the output file dirname'
```

### source


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

#### output  build/a.rpx.css

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
