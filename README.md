# dfs-rem2rpx

According to one stylesheet,make the rem to rpx

Version: **1.0.4**
### Notice 
    The version in 1.* is just support the file of css and less

### install 
    Run npm install dfs-rem2rpx -g

### Usage
```
rem2rpx -o build a.css
```

### source a.css

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

### output  build/a.rpx.css
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
