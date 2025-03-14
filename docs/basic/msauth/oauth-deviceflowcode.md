# 1.6.3 设备代码流登录（自有客户端）

:::warning

无论你的启动器是否有能力保护 Token 的私密性，都请妥善保存 Token。

最佳的保存位置应当是凭据管理器，其次是注册表和用户文件夹等（建议加密）。

无论如何请勿将其放在游戏文件夹下，用户可能会分发此文件夹下的内容导致 Token 泄露！

:::

:::tip

此登录方法需要开发者注册 Microsoft Azure 账户，并在 Microsoft Azure Entra ID 管理单元注册应用程序。

注册后应用程序需要交由 Mojang 审批后才能登录，并注意需要在应用程序的身份验证中允许设备流验证。

OAuth 设备代码流验证总体上简化了验证逻辑，但同时增加了安全风险。
:::


:::tip 什么是设备代码流？

设备代码流是 OAuth 2.0 规范中专门用于提供给无 GUI 环境下进行 OAuth 身份认证的一种认证形式。

在此情况下，请求授权的客户端会从 OAuth 身份认证服务器获取一个代码对，包含了需要展示给用户的授权码和轮询授权结果的设备码。

客户端需要将授权码展示给用户并引导用户访问指定页面输入这串授权码，用户需要在此页面选择是否授权。

在用户授权期间，应用程序需要以 interval 为间隔（一般是 5 秒，但实际上可能更长或更短，具体以身份认证服务器的指示为准。），持续请求 OAuth 身份认证服务器的令牌端点，直到用户完成/拒绝授权或者遇到不应继续轮询的错误。

代码对具有有效期，其有效时间由 OAuth 身份认证服务器在 expired_in 提供。

interval 由 OAuth 身份验证服务器附加在返回的 json 中。

基本格式如下

```json
{
  "device_code":"device_code", //应用程序需要暂存此代码用于轮询用户授权状态
  "user_code":"user_code", //应用程序需要将此代码展示给用户
  "verification_uri":"verification_uri", //应用程序需要引导用户在此输入授权码并确认授权
  "expires_in":3600, //代码对有效期，在超出此时间后失效，单位为秒
  "interval":5, //应用向验证服务器轮询用户授权状态的最小间隔时间，单位为秒
}
```

:::

## 获取代码对

```http
POST https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode
```

被提交的数据为

```http
client_id=client_id&scope=XboxLive.signin offline_access
```

如果 client_id 有效，将收到如下响应。

```json
{
  "device_code":"device_code", //应用程序需要暂存此代码用于轮询用户授权状态
  "user_code":"user_code", //应用程序需要将此代码展示给用户
  "verification_uri":"verification_uri", //应用程序需要引导用户在此输入授权码并确认授权
  "expires_in":"expires_in", //代码对有效期，在超出此时间后失效，单位为秒
  "interval":"interval", //应用向验证服务器轮询用户授权状态的最小间隔时间，单位为秒
  "message":"message", //用于指导用户登录的文本，默认为英文，可在查询参数中指定 ?mtk=<语言区域性代码> 来将此内容本地化，但建议自行生成文本指导 
}
```

:::tip

Microsoft OAuth 的代码对响应并不包含 verification_uri_complete 字段，因为在 OAuth 规范中，此项为可选。

:::

## 授权与令牌获取

启动器需要向用户展示授权码和授权页面（可自动拉起浏览器，根据实际需要完成。）

随后以 interval 为间隔，向令牌端点轮询用户授权状态。

```http
POST https://login.microsoftonline.com/consumers/oauth2/v2.0/token
```

被提交的数据为

```http
grant_type=urn:ietf:params:oauth:grant-type:device_code&client_id=<client_id>&device_code=<device_code>
```

如果用户同意授权请求，则会收到如下响应。

```json
{
    "token_type": "Bearer", // 令牌类型
    "scope": "scope", //申请的权限
    "expires_in": 3600, //访问令牌过期时间
    "access_token": "access_token", //访问令牌
    "refresh_token": "refresh_token", //刷新令牌
    "id_token": "id_token" // 如果未要求 openid 权限则此项不存在
}
```

如果用户拒绝授权，或者登录过程中出现未预期的错误时，OAuth 验证服务器将在返回的 Json 中包含 error 字段。

目前已知的字段如下。

- authorization_pending：用户未授权。

解决方案：等待 interval 秒后再次轮询。

- authorization_declined：用户拒绝了授权。

解决方案：中止轮询并向提示用户已拒绝授权。

- bad_verification_code：未在提交数据中包含 device_code 字段或提交的 device_code 无效。

解决方案：在启动器内检查提交的数据是否缺失 device_code 字段，并尝试重新构建请求数据，若错误持续则中止轮询并显示错误信息。

- expired_token：轮询验证时间超过了 expires_in 的值。

解决方案：中止轮询并向提示用户授权超时。

- slow_down：应用程序的轮询间隔小于 interval 给定的值。

解决方案：在下次轮询时间隔 interval + 5 * 错误出现次数。

- invalid_request：请求格式有误。

解决方案：检查请求格式，并确保 headers 中设置了 Content-Type 为 application/x-www-form-urlencoded。

- invalid_grant：使用了已经被使用的 device_code。

解决方案：重新从 OAuth 身份验证服务器获取新的 device_code，并覆盖现有值。


:::warning 温馨提示

由于 Microsoft OAuth 身份认证服务器可能存在未知 Bug，部分账号在切换账号/使用 Passkey/邮箱验证码/手机验证码等不使用密码登录的方式也有概率触发 invalid_grant 错误。

经过调查，此情况下具有使用密码登录的成功率远高于使用 Passkey/验证码登录的奇妙特性，所以不妨在一开始或者触发此错误时建议用户使用密码登录。

:::


### 示例代码

```python
import requests as r
import webbowser as wb
import time


headers = {
    "Content-Type":"application/x-www-url-form-encoded",
    "Accept":"application/json"
}

login_verify_data = f"client_id={ms_client_id}&scope=XboxLive.signin offline_access"

resp = r.post(url="https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode",headers=headers,data=login_verify_data)

resp_json = resp.json()

user_code = resp_json.get("user_code")

device_code = resp_json.get("device_code")

interval = resp_json.get("interval")

verification_uri = resp_json.get("verification_uri")

expired_time = resp_json.get("expired_in")

access = None

refresh = None

if user_code and device_code:
    print(f"""
本次登录授权码为:{user_code}，有效时间:{expired_time // 60} 分钟
请在 {verification_uri} 输入此授权码并授权。
建议在登录过程中使用密码进行登录。
    """)
    # 假设这是你的写入剪切板函数
    write_clipboard(user_code)
    # 让用户看完提示
    time.sleep(3)
    wb.open(verification_uri)
    loop_login_data = f"grant_type=urn:ietf:params:oauth:grant-type:device_code&client_id={ms_client_id}&device_code={device_code}" 
    while True:
        time.sleep(interval)
        resp = r.post(url="https://login.microsoftonline.com/consumers/oauth2/v2.0/token")
        resp_json = resp.json()
        if not resp_json.get("error") == None:
            match resp_json.get("error").lower():
                case "authorization_pending":
                    continue
                case "authorization_declined":
                    print(f"""
轮询登录失败：用户拒绝授权
                    """)
                    break
                case "bad_verification_code":
                    if (not "&device_code=" in loop_login_data or not device_code in loop_login_data) and device_code != None:
                        loop_login_data = f"grant_type=urn:ietf:params:oauth:grant-type:device_code&client_id={ms_client_id}&device_code={device_code}"
                    else:
                        print("""
轮询登陆失败：无效的 device_code
                        """)
                        break
                case "expired_token":
                    print("""
轮询登录失败：登录超时
                    """)
                case "slow_down":
                    interval += interval
                case "invalid_grant":
                    if "AADSTS70000" in resp_json.get("error_description"):
                        print("""
轮询登录失败：需要使用密码登录
请重新尝试登录，并观察登录页面是否有其他登录方法，如果有，点击此选项，然后选择通过密码登录。
如果你没有看到使用密码登录的选项，说明该账户没有设置密码，请前往 https://account.live.com/password/Change 添加/修改密码。
                        """)
        else:
            break
    return resp_json.get("access_token"),resp_json.get("refresh_token")
                        
```

## 刷新登录

一般情况下，Minecraft 的访问令牌有效期为 86400 秒（也就是一天），在这种情况下，用户昨天登录完今天会话就失效了，也就是需要用户重新登录.....

那能让用户每天都登录账号吗？那很明显不能啊，要真这样用户迟早会烦死。

好在 OAuth 规范中有个名为 refresh_token 的东西，这允许应用程序保持登录状态而不至于会话一过期用户就得重新登录（果然人类的科技都是往最方便的方向发展的）

```http
POST https://login.microsoftonline.com/consumers/oauth2/v2.0/token
```

我们需要提交的数据为

```http
client_id=<ms_client_id>&refresh_token=<刷新令牌>&grant_type=refresh_token&scope=XboxLive.signin offline_access
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