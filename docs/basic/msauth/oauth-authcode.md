# 1.6.1 OAuth 授权代码流登录


:::warning

无论你的启动器是否有能力保护 Token 的私密性，都请妥善保存 Token。

最佳的保存位置应当是凭据管理器，其次是注册表和用户文件夹等（建议加密）。

无论如何请勿将其放在游戏文件夹下，用户可能会分发此文件夹下的内容导致 Token 泄露！

:::

## 用户交互部分

第一步需要启动器让用户访问如下页面。

```
https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=00000000402b5328&response_type=code&scope=XboxLive.signin%20offline_access&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf

```

待用户在此登录后，浏览器会自动重定向到 https://login.live.com/oauth20_desktop.srf。

你需要让用户将这串链接完整的输入到弹出的窗口上。

## 启动器部分

在用户输入后，你需要解析 Url 并获取到其中的 code 参数，这是一个有效期仅有十分钟的 OAuth 授权码，你需要通过这串代码获取账户的访问令牌与刷新令牌。

将授权码提取后，你需要新建一个字符串对象，按照如下格式进行拼接

```http

client_id=00000000402b5328&code=<上一步获取的授权码>&grant_type=authorization_code&redirect_uri=https://login.live.com/oauth20_desktop.srf&scope=XboxLive.signin%20offline_access

```

将请求头中的 Content-Type 设置为 application/x-www-form-urlencoded，Accept 设置为 application/json，随后向下面的 Url 发送 POST 请求以登录到 Microsoft 账户。

```http

POST https://login.microsoftonline.com/consumers/oauth2/v2.0/token

```

响应为

```json
{
   "token_type":"Bearer",
   "scope":"XboxLive.signin XboxLive.offline_access",
   "expires_in":3600,
   "ext_expires_in":3600,
   "access_token":"<访问令牌>",
   "refresh_token":"<刷新令牌>"
}

```

这里我们需要保存两个数据，access_token 和 refresh_token。

## 代码示例

```python

import requests as r
import webbowser as wb
from urllib.parse import urlparse,urlparse_qs

wb.open("https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=00000000402b5328&response_type=code&scope=XboxLive.signin%20offline_access&redirect_uri=https%3A%2F%2Flogin.live.com%2Foauth20_desktop.srf")

user_input=input("输入浏览器上的地址:")

url_parse = urlparse(user_input)

query_data = urlparse_qs(url_parse.query)

user_auth_code = query_data.get("code")

if user_auth_code:
    headers = {
        "Content-Type":"application/x-www-form-urlencoded",
        "Accept":"application/json"
    }
    req_data = f"client_id=00000000402b5328&code={user_auth_code}&grant_type=authorization_code&redirect_uri=https://login.live.com/oauth20_desktop.srf&scope=XboxLive.signin%20offline_access"  
    resp = r.post(url="https://login.microsoftonline.com/consumers/oauth2/v2.0/token",headers=headers,data=req_data)
    resp_json = resp.json()
    access = resp.get("access_token")
    refresh = resp.get("refresh_token")
    if access and refresh:
        return access,refresh
    return "error","invalid response"

```

至此我们完成了 Microsoft OAuth 登录过程。

## 刷新登录

一般情况下，Minecraft 的访问令牌有效期为 86400 秒（也就是一天），在这种情况下，用户昨天登录完今天会话就失效了，也就是需要用户重新登录.....

那能让用户每天都登录账号吗？那很明显不能啊，要真这样用户迟早会烦死。

好在 OAuth 规范中有个名为 refresh_token 的东西，这允许应用程序保持登录状态而不至于会话一过期用户就得重新登录（果然人类的科技都是往最方便的方向发展的）

```http

POST https://login.microsoftonline.com/consumers/oauth2/v2.0/token

```

我们需要提交的数据为

```http
client_id=00000000402b5328&refresh_token=<刷新令牌>&grant_type=refresh_token&scope=XboxLive.signin offline_access
```

如果令牌有效，将会收到如下响应。

```json
{
   "token_type":"Bearer",
   "scope":"XboxLive.signin XboxLive.offline_access",
   "expires_in":3600,
   "ext_expires_in":3600,
   "access_token":"<新的账户访问令牌>",
   "refresh_token":"<新的刷新令牌>"
}
```

### 示例代码

```python
import requests as r

login_data = f"client_id={ms_client_id}&refresh_token={refresh}&grant_type=refresh_token&scope=XboxLive.signin offline_access"

resp = r.post(url="https://login.microsoftonline.com/consumers/oauth2/v2.0/token",headers=headers,data=login_data)

resp_json = resp.json()

access = resp_json.get("access_token")
refresh = resp_json.get("refresh_token")
if refresh and access:
    return access,refresh
else:
    return "error","invalid response"
```


扩展阅读：[在线服务-登录](../online.service/login)