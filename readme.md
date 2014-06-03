# LESSON 3

### 如何建立一个包

好好的复习一下包的建立机制

不要搞反npm install xxx --save-dev 是对的 npm install xxx --dev-save是错的

### Handler是一个什么东西

### 异步测试的时候的done，callback...

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

### 备注

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

# LESSON 7

关于Constructor的概念。

== 和 === ：在Javascript里不要使用 == 和 != 

## 读书笔记 《Node.js 开发指南》 人民邮电出版

-   Javascript的对象机制是基于原型的，支持部分多重继承满吃过EventEmitter不会打乱对象原有的继承关系。

-   全局作用域，在浏览器中是window而在Node.js里是global

    -   在最外层定义的变量
    -   全局对象的属性
    -   任何地方隐式定义的变量（未定义直接赋值的变量） 
    
    第三大需要格外注意

### 闭包

当一个函数返回它内部定义的一个函数时，就产生了一个闭包，闭包不但包括这个被返回的函数，还包括这个函数的定义环境。

### Javascript里面的面向对象

在大部分语言里，比方说Ruby，python这种基于类的面向对象。但是Javascript里面没有类的概念，不是说Javascript不是面向对象的语言。

### 关于构造函数和原型

    function Foo() {
      var innerVar = 'hello';
      this.prop1 = "Taffyer";
      this.func1 = function() {
        innerVar = '';
      };
    }
    Foo.prototype.prop2 = 'HIT';
    Foo.prototype.fun2 = function() {
      console.log(this.prop2);
    }

    var foo1 = new Foo();
    var foo2 = new Foo();

    console.log(foo1.func1 === foo2.fun1); // Out put false
    consolg.log(foo1.func2 === foo2.fun2); // Out put true

# LESSON 9

关于耦合度。在Javascript里一直有人提耦合度的概念，耦合度低的代码可读性好。

### 回调函数 Callback

又掉了一次坑。。。回调函数没有执行。每一次掉坑完毕之后，对于回调的理解就更深一层次，还是回归原始，回调函数其实就是把函数作为参数传过去（沿袭C的说法就是函数的指针传过去，所以传过去的仅仅是指针而已，并不是返回值，函数并没有被执行！！），

# LESSON 10

一开始遇到一个奇怪的错误。

    Uncaught TypeError: Object #<ServerResponse> has no method 'push'
    at HTTPParser.parserOnMessageComplete [as onMessageComplete] (http.js:168:14)
    at Socket.socket.ondata (http.js:1966:22)
    at TCP.onread (net.js:525:27)

后来发现是把`require("../lib/response")`写成了`require("../lib/request")`, 尽管两个文件的内容是一样的，但由于require的cache的机制就出现了问题。

# LESSON 12

原本的字符串并不是`instanceof String`
可以用`typeof "foo" === "string"`来做判断

有一个测试没过，我感觉测试是写错了吧。在Etag的前后不需要各加一个`"`，本身就是字符串了呀。

    .expect("ETag",'"1306201125"')

应该是

    .expect("ETag","1306201125")

# LESSON 13

