# css实现tab切换
# 1. :target
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    .container {
      position: relative;
      width: 400px;
      margin: 50px auto;
    }
    .nav {
      position: relative;
      overflow: hidden;
    }
    ul {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    ul li {
      flex: 1;
      padding: 3px;
      border: 1px solid #ccc;
    }
    #content1,
    #content2 {
      display: none;
    }
    #content1:target,
    #content2:target {
      display: block;
    }
    #content1,
    #content2 {
      position: absolute;
      overflow: hidden;
      top: 36px;
      width: 400px;
      height: 100px;
      border: 1px solid #999;
      box-sizing: border-box;
      padding: 10px;
    }
    li {
      width: 200px;
      float: left;
      text-align: center;
      background: #ddd;
    }

    li a {
      display: block;
      width: 200px;
      line-height: 36px;
      font-size: 18px;
      cursor: pointer;
      text-decoration: none;
      color: #000;
    }
    #content1:target ~ .nav li:first-child{
      background: #ddd;
	    color: #000;
    }
    #content1:target ~ .nav li:first-child {
      background: #ff7300;
      color: #ccc;
    }
    #content2:target ~ .nav li:first-child{
      background: #ddd;
	    color: #000;
    }
    #content2:target ~ .nav li:last-child {
      background: #ff7300;
      color: #ccc;
    }
  </style>
</head>
<body>
<div class="container">
    <div id="content1">列表1内容:123456</div>
    <div id="content2">列表2内容:abcdefgkijkl</div>
  
    <ul class='nav'>
        <li><a href="#content1">列表1</a></li>
        <li><a href="#content2">列表2</a></li>
    </ul>
  
    <div class="wrap"></div>
</div>
</body>
</html>
```
# 2. :checked
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
.container{
	position:relative;
	width:400px;
	margin: 50px auto;
}

input{
	display:none;
}

.nav{
	position:relative;
	overflow:hidden;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
li{
	width:200px;
	float:left;
	text-align:center;
	background:#ddd;
}

li label{
	display:block;
	width:200px;
	line-height:36px;
	font-size:18px;
	cursor:pointer;
}

.content{
	position:relative;
	overflow:hidden;
	width:400px;
	height:100px;
	border:1px solid #999;
	box-sizing:border-box;
	padding:10px;
}
.content1,
.content2 {
  display: none;
}
.nav1:checked ~ .content .content1,
.nav2:checked ~ .content .content2 {
  display: block;
}
.nav1:checked ~ .nav li {
  background: #ddd;
  color: #000;
}
.nav1:checked ~ .nav li:first-child {
  background: #ff7300;
  color: #fff;
}
.nav2:checked ~ .nav li {
  background: #ddd;
  color: #000;
}
.nav2:checked ~ .nav li:last-child {
  background: #ff7300;
  color: #fff;
}
  </style>
</head>
<body>
<div class="container">
    <input class="nav1" type="radio" id="li1" name="nav">
    <input class="nav2" type="radio" id="li2" name="nav">    

    <ul class="nav">
      <li><label for="li1">列表1</label></li>
      <li><label for="li2">列表2</label></li>
    </ul>
  
    <div class="content">
      <div class="content1">列表1</div>
      <div class="content2">列表2</div>
    </div>
</div>
</body>
</html>
```
