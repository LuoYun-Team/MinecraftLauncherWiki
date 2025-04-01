# 1.7.1 登录到 Minecraft

在 1.6.1/1.6.2/1.6.3 中我们完成了 Microsoft OAuth 登录，现在我们需要使用 Microsoft 账户访问令牌获取 Minecraft 的访问令牌。

但是从哪里换取访问令牌呢？

## XboxAPI

作为 Microsoft 旗下公司的游戏，Microsoft 自然将其放在了自家的游戏平台，这个平台就是 Xbox。

其实从 OAuth 登录部分就可以看出，我们申请了 XboxLive.signin 这个权限，这个权限可不是瞎申请的，既然要申请就必然会有用到它的地方（不然就违背最小权限原则了）。

:::tip 最小权限原则是什么

最小权限原则指的是，一个应用程序/用户将具有完成某个任务的最小权限的集合，但这个应用程序/用户只能申请完成任务所必须的权限。

:::

### Microsoft -> Xbox Live

既然我们知道了这个游戏存放在 Xbox，那么为了获取这个游戏的访问令牌，我们就必然需要登录到对应的平台（不登录那不就成离线了么，那写这个文档不就完全没用了么）。

```http
POST https://user.auth.xboxlive.com/user/authenticate
```

我们需要提交的数据为

```json
{
    "Properties":{
        "AuthMethod":"RPS",
        "SiteName":"user.auth.xboxlive.com",
        "RpsTicket":"<Microsoft 账户访问令牌>"
    },
    "RelyingParty": "http://auth.xboxlive.com",
    "TokenType": "JWT"
}

```

需要将 Content-Type 和 Accept 都设置为 application/json。

如果 Microsoft 账户访问令牌有效，我们将收到如下响应。


```json
{
   "IssueInstant":"2020-12-07T19:52:08.4463796Z",
   "NotAfter":"2020-12-21T19:52:08.4463796Z",
   "Token":"token", // 这是 XboxLive Token
   "DisplayClaims":{
      "xui":[
         {
            "uhs":"uhs" // Xbox User Hash，后面登录需要，保存
         }
      ]
   }
}
```

我们需要提取其中的 Token 和 Xbox User Hash。

#### 示例代码

```python
import requests as r
import json


login_data = {
    "Properties":{
        "AuthMethod":"RPS",
        "SiteName":"user.auth.xboxlive.com",
        "RpsTicket":ms_access_token
    },
    "RelyingParty": "http://auth.xboxlive.com",
    "TokenType": "JWT"
}

headers = {
    "Content-Type":"application/json",
    "Accept":"application/json"
}

resp = r.post(url="https://user.auth.xboxlive.com/user/authenticate",headers=headers,data=json.dumps(logon_data))

resp_json = resp.json()

token = resp_json.get("Token")
xhs = resp_json.get("DisplayClaims",{}).get("xui",[{}])[0].get("uhs")

if token and xhs:
    return token,xhs

else:
    return "error","invalid response"

```

### Xbox Live -> XSTS

现在，我们登陆到了 XboxLive，并获取了对应的访问令牌，现在需要通过 XboxLive Token 获取 XSTS Token，获取到 XSTS Token 后，我们就能用 XSTS 令牌登录 Minecraft 验证服务器了。

我们需要提交的数据为

```http
POST https://xsts.auth.xboxlive.com/xsts/authorize
```

```json
{
    "Properties": {
        "SandboxId": "RETAIL",
        "UserTokens": [
            "<XboxLiveToken>"
        ]
    },
    "RelyingParty": "rp://api.minecraftservices.com/",
    "TokenType": "JWT"
}
```

如果认证通过，将会收到如下响应。

```json
{
   "IssueInstant":"2020-12-07T19:52:09.2345095Z",
   "NotAfter":"2020-12-08T11:52:09.2345095Z",
   "Token":"XSTS Token", // 这是你的 XSTS 令牌
   "DisplayClaims":{
      "xui":[
         {
            "uhs":"XboxUserHash" // 如果上个请求没有保存那请保存，否则无法登录 Minecraft 验证服务器
         }
      ]
   }
}
```

#### 示例代码

```python
import requests as r
import json


login_data = {
    "Properties": {
        "SandboxId": "RETAIL",
        "UserTokens": [
            xbl_token
        ]
    },
    "RelyingParty": "rp://api.minecraftservices.com/",
    "TokenType": "JWT"
}

headers = {
    "Content-Type":"application/json",
    "Accept":"application/json"
}

resp = r.post(url="https://user.auth.xboxlive.com/user/authenticate",headers=headers,data=json.dumps(logon_data))

resp_json = resp.json()

token = resp_json.get("Token")
# 如果需要可以取消注释
# xhs = resp_json.get("DisplayClaims",{}).get("xui",[{}])[0].get("xhs")

if token:
    return token

else:
    return "error","invalid response"
```

## Minecraft Yggdrasil API

### XSTS -> Minecraft Yggdrasil

现在，我们终于能登录到 Minecraft 验证服务器了，上一步兑换的 XSTS 令牌允许我们直接登录到 Minecraft 验证服务器。

```http
POST https://api.minecraftservices.com/authentication/login_with_xbox
```

我们需要提交的数据为

```json
{
    "identityToken": "XBL3.0 x=<uhs>;<xsts_token>" // 如果你把文档之前反复强调要保存 Xbox User Hash 当大惊小怪的话，那么恭喜你，你要重新走一遍登录流程了 XD
}
```

这里登录需要 XboxUserHash 和 XSTSToken，也是前两步一直在强调要保存 XboxUserHash 的原因。

如果令牌有效，那么将收到如下响应。

```json
{
  "username" : "uuid", // 这不是 Minecraft 档案的 UUID，不需要保存
  "roles" : [ ],
  "access_token" : "minecraft access token", // Minecraft 在线服务/启动用的访问令牌
  "token_type" : "Bearer",
  "expires_in" : 86400
}
```

#### 示例代码

```python

import requests as r
import json

headers = {
    "Content-Type":"application/json",
    "Accept":"application/json"
}

login_data = {
    "identityToken":f"XBL3.0 x={uhs};{xsts_token}"
}

resp = r.post(url="https://api.minecraftservices.com/authentication/login_with_xbox",headers=headers,data=json.dumps(login_data))

resp_json = resp.json()

access_token = resp_json.get("access_token")

if access_token:
    return access_token
else:
    return "invalid response"

```

似乎到这一步就大功告成了？就可以启动游戏了？

诶，别急，先接着往下看。


### 验证产品许可

:::warning

根据 [HMCL-dev/HMCL#2986](https://github.com/HMCL-dev/HMCL/pull/2986) / [PojavLauncherTeam/PojavLauncher#5370](https://github.com/PojavLauncherTeam/PojavLauncher/issues/5370) / [Hex-Dragon/PCL2#3702](https://github.com/Hex-Dragon/PCL2/issues/3702) 等 PR/Issues 反馈，跳过此步骤会导致无法获取新账号档案信息，所以请不要尝试跳过这一步。

:::

事情远没有你想的那么简单....

在启动游戏前，我们需要先检查产品许可（此前众多步骤都没有检查这个）。

这一步需要将 Authorization 设置为 Bearer <Minecraft 访问令牌>

```http
GET https://api.minecraftservices.com/entitlements/mcstore
```

如果用户真的持有游戏的有效许可，那么响应如下

```json
{
  "items" : [ {
    "name" : "product_minecraft",
    "signature" : "jwt sig"
  }, {
    "name" : "game_minecraft",
    "signature" : "jwt sig"
  } ],
  "signature" : "jwt sig",
  "keyId" : "1"
}
```

如果用户未持有游戏的有效许可，那么 items 是个空列表，此时你要提醒用户这个账号没有许可。

#### 示例代码

```python
import requests as r

headers ={
    "Authorization":f"Bearer {minecraft_yggdrasil_token}"
}

resp = r.get(url="https://api.minecraftservices.com/entitlements/mcstore")

if not resp.json().get("items"):
    return "error","not license"

```

### 获取游戏档案

:::warning 再次提醒

请不要尝试只做这一步来检查用户是否持有有效许可和获取档案信息，原因见[验证产品许可](./login#验证产品许可)的警示条

:::

现在，你的账号经过了千锤百炼，通过了 Microsoft OAuth2 、XboxLive Auth、 XSTS Auth、Minecraft Yggdrasil Auth、产品许可检查，成功通过了试炼，是时候扬帆起航了........吗？

你是不是忘记了什么重要的东西？

让我们回看一下 [1.2 处理游戏文件](../file) 提供的 Json 文本。

```
    "--username",
    "${auth_player_name}",
    "--version",
    "${version_name}",
    "--gameDir",
    "${game_directory}",
    "--assetsDir",
    "${assets_root}",
    "--assetIndex",
    "${assets_index_name}",
    "--uuid",
    "${auth_uuid}",
    "--accessToken",
    "${auth_access_token}",
    "--clientId",
    "${clientid}",
    "--xuid",
    "${auth_xuid}",
    "--userType",
    "${user_type}",
    "--versionType",
    "${version_type}",
```

是的，你不是只传个 AccessToken 就能启动游戏了~~，拖更王 Mojang 才不会帮你做获取档案这一步呢 (☆-ｖ-)~~。

同样的需要设置 Authorization 头。

```http
GET https://api.minecraftservices.com/minecraft/profile
```

如果玩家持有游戏且有建立玩家档案的话，那么响应如下。

```json
{
  "id" : "", // 账号的真实 UUID
  "name" : "", // 该账号的 Minecraft 用户名
  // 用户的材质
  "skins" : [ {
    "id" : "6a6e65e5-76dd-4c3c-a625-162924514568",
    "state" : "ACTIVE", //材质状态
    "url" : "https://textures.minecraft.net/texture/1a4af718455d4aab528e7a61f86fa25e6a369d1768dcb13f7df319a713eb810b", //材质的下载地址
    "variant" : "CLASSIC",
    "alias" : "STEVE"
  } ],
  "capes" : [ ]
}
```

如果用户不满足上述条件之一，那么响应如下。

```json
{
  "path" : "/minecraft/profile",
  "errorType" : "NOT_FOUND",
  "error" : "NOT_FOUND",
  "errorMessage" : "The server has not found anything matching the request URI",
  "developerMessage" : "The server has not found anything matching the request URI"
}
```

#### 示例代码


```python
import requests as r

headers = {
    "Authorization":f"Bearer {minecraft_yggdrasil_token}"
}

resp = r.get(url="https://api.minecraftservices.com/minecraft/profile",headers=headers)

resp_json = resp.json()

name = resp_json.get("name")
uuid = resp_json.get("id")

if name and id:
    return name,id
else:
    return "error","invalid profile"

```