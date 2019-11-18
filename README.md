# dfs-rem2rpx

According to one stylesheet,make the rem to rpx

Version: **1.1.1**
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
rem2rpx -o build a.css

options:
-u, --rpxUnit :set `rpx` unit value (default: 100)'
-r, --rpxVersion :whether to generate rpx version stylesheet (default: true)
-p, --rpxPrecision :set rpx value precision (default: 6)', 6)
-o, --output [path]', 'the output file dirname'
```

### source
#### the source file is a css file like a.css
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
### Usage less file

```
rem2rpx -o build a.less
```
#### the source file is a less file like a.less
```
.a {
    width: 1rem;
    height: .1rem;
    line-height: 0.1rem;
    border: 1px solid red;
    .c{
        width: 1rem;
        height: .1rem;
        line-height: 0.1rem;
        border: 1px solid red;
    }
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

#### output  build/a.css
```
  .a {
  width: 1rem;
  height: 0.1rem;
  line-height: 0.1rem;
  border: 1px solid red;
}
.a .c {
  width: 1rem;
  height: 0.1rem;
  line-height: 0.1rem;
  border: 1px solid red;
}
.b {
  width: 1rem;
  /*no*/
  padding: 0.2rem 0.4rem 0 0.4rem;
}
@keyframes mymove {
  from {
    top: 0px;
  }
  to {
    top: 2rem;
  }
}
@media screen and (max-width: 300px) {
  body {
    width: 3rem;
    height: 1rem;
    /*no*/
  }
}

  ```

#### finally output  build/a.rpx.css

```
  .a {
  width: 100rpx;
  height: 10rpx;
  line-height: 10rpx;
  border: 1px solid red;
}

.a .c {
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
