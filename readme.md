# LESSON 3

## 如何建立一个包

好好的复习一下包的建立机制

不要搞反npm install xxx --save-dev 是对的 npm install xxx --dev-save是错的

## Handler是一个什么东西

## 异步测试的时候的done，callback...

笔记：jQuery里的回调。

可以参考这两段代码：

    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Callback Example</title>
      </head>
      <body>
        <h1>Callback Examole</h1>
        <p>Elit iure saepe placeat laborum earum. Esse iure eligendi placeat ratione consequuntur provident obcaecati veritatis, quidem aspernatur similique. Non cupiditate distinctio non doloremque dolorem iure quibusdam. Qui dolor aliquam reprehenderit.</p>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script>
          $(function () {
            $('p').hide('slow', function() {
              alert("The paragraph is now hidden");
            });
          });
        </script>
      </body>
    </html>

以及

    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Callback Example</title>
      </head>
      <body>
        <h1>Callback Examole</h1>
        <p>Elit iure saepe placeat laborum earum. Esse iure eligendi placeat ratione consequuntur provident obcaecati veritatis, quidem aspernatur similique. Non cupiditate distinctio non doloremque dolorem iure quibusdam. Qui dolor aliquam reprehenderit.</p>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script>
          $(function () {
            $('p').hide('slow');
            alert("The paragraph is now hidden");
          });
        </script>
      </body>
    </html>

异步编程，回调，事件，都是Javascript里面的几个经典的地方。

## 备注

掉坑 expect = require("chai").expect;

# LESSON 4

不太会写测试。掉了一个坑，before和beforeEach，所以一直通不过自己的测试。Memo里写错了这个

    raise new error("boom") 
    
改成

    throw new Error("boom")


在Error Handler那里卡了很长很长时间，但是理清楚逻辑以后一想其实还是没那么难的。看了一下Connect的源代码，有一个app.handle的函数，代码确实很短啊。

# LESSON 5

关于Prototype

Instance 和 Object

不知道 request.url 和 request.path 有什么区别

# LESSON 6

不知道在Javascript `this.foo = xxx` 和 `function() { var foo; foo = xxx }` 有什么区别啊？
