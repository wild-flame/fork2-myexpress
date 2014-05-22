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

不太会写测试。掉了一个坑，before和beforeEach，所以一直通不过自己的测试。

    raise new error("boom") => throw new Error("boom")
