# 用 Flask 和 AngularJs 实现HTTP认证

本文介绍用Flask 和 AngularJs 实现 HTTP Basic Auth。

要实现登录认证功能，常用的有以下这两种方法：

1. [Basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication "Basic access authentication")
2. [Digest access authentication](https://en.wikipedia.org/wiki/Digest_access_authentication "Digest access authentication")

这两种方法各有优劣，

- Basic access authentication 主要是胜在简单，只需要在Requset Header中加入 `Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==`，其中字符串"Basic "后面的是"username:password"字符串的Base64编码，如果验证不成功，server会在Response Header中返回`WWW-Authenticate: Basic realm="domain"`，状态码为401。但是这个方法不安全，在生产环境中须要在HTTPS下使用。但也因为他够简单，我们可以在开发测试环境中使用。
- Digest access authentication 顾名思义，主要是通过server端返回的随机码和摘要算法对username和password、realm以及需要发送的请求内容提取摘要，发送给server，该方法相比Basic access authentication来说稍稍复杂，但是却有较强的安全性。

详细介绍请看我的博客 [flask-angular-http-auth](http://khalily.github.io/2015/08/24/flask-angular-http-auth/)

## 运行
要让程序成功跑起来，首先创建virtualenv，然后安装依赖

    pip install -r requirements.txt
然后创建数据库

    $ python manager.py create_db
然后创建用户名和密码

    $ python manager.py shell

    >>> u = User(name='admin')
    >>> db.session.add(u)
    >>> db.session.commit()
最后运行服务

    $ python manager.py runserver
