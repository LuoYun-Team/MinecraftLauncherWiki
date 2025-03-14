# 1.5 第三方登录

::: warning

在未验证用户是否持有合法且有效的 Minecraft 副本前为其开放第三方登录选项与美国和欧盟等国家的版权法相冲突。此做法会被 DMCA（数字千年版权法） 等法律视为侵犯版权，是一种违法行为！

如果你的启动器计划进行国际化，请务必验证用户是否持有合法且有效的 Minecraft 副本！这可以避免给你和你的用户带来法律责任！

:::

## 第三方登录是什么？

第三方登录，顾名思义就是由第三方提供身份认证，进而实现使用不同账号就能游玩到同一游戏。

目前大部分国内游戏（鹅厂等例外）均支持第三方登录，这在国内也被称为渠道服。

## 为什么需要第三方登录？

试想一下，你运行了一个 Minecraft 服务器，并且稳定运行了很久，但某一天被无聊的人知道了服务器 IP，并且知道了你的服务器没有额外的安全措施，你的服务器马上就被一堆匿名账号轰炸了....

大部分第三方 Minecraft 服务器在运行过程中都或多或少的面临这样的安全风险，因为 Minecraft 服务器在离线模式下只要切换用户名就能实现账号切换的目的，而不会去验证用户名（也就是不会验证你真的是你），而 0 成本的批量匿名账号正是轰炸服务器和开挂的绝佳利器.....

就算没有人轰炸，也可能出现串号勒索，或者不小心改了用户名但是忘了原先的名字.....

总之这给服务器的管理团队带来极大的客服压力和超高的管理难度。

也许有些头疼不已的服主会给服务器安装诸如 AuthMe 等登录插件，但是这些插件都有共同弊端————除了串号问题外其他都解决不了，虽然配合白名单能解决很多问题，但这样就难以继续吸纳新用户（除非服主 24 小时在线），并且配置繁琐，教程缺失，插件更新缓慢，这些数据也不会跨服通用，每个服务器都需要重新配置，其他人根本看不到你的自定义皮肤

虽然确实可以用 CustomSkinLoader 或万用皮肤补丁之类的 Mod 完成这些任务（不过其他人终究是看不到你的皮肤），但是考虑到兼容性和配置难度，应该没有服主喜欢这种方案？



那有没有什么比较通用的解决方案呢？

对了，就是第三方登录！

## Authlib-Injector

现有的第三方登录实现并不只有这一种，不过这里只介绍一种，就是 Authlib-Injector，这也是目前比较通用且大部分场景下配置较为简单的一种实现。

Authlib-Injector 的基本实现原理是通过字符串常量替换，将 Authlib 硬编码的官方验证服务器地址劫持到第三方实现上从而实现通过第三方服务器完成身份认证功能。

:::warning

Authlib 和 Authlib-Injector 是两个不同的东西。

:::

通过第三方登录，账号管理任务就交给了第三方皮肤站的管理团队，用户只需在皮肤站注册账号，然后在启动器登录，就能直接游玩服务器，并且还能看到自定义皮肤，不同服务器之间账号通用无需注册，忘记密码也能申请重置，服主只需专心管理服务器即可。


## Yggdrail ALI 指示

Yggdrasil 验证服务器一般会在请求响应头内增加 `X-Authlib-Inject-API-Location`。

通过此字段，可以实现仅填写域名就能使用认证服务的功能。

**此处假定 Yggdrasil Web 地址为 yggdrasil.example.com，Yggdrasil API 地址为 api.example.com**

例子


```python
import requests

response = requests.head(url="https://yggdrasil.example.com")

location = response.headers.get("X-Authlib-Inject-API-Location")

```

## API 元数据检查（可选）

不同 Yggdrasil API 之间支持的功能并不相同，事实上 Authlib-Injector 的 Yggdrasil 规范也提供了一些可选功能，认证服务器可根据具体业务需求来自行决定是否启用/关闭一项或多项功能。

具体支持功能[可查看此](https://github.com/yushijinhun/authlib-injector/wiki/Yggdrasil-%E6%9C%8D%E5%8A%A1%E7%AB%AF%E6%8A%80%E6%9C%AF%E8%A7%84%E8%8C%83#%E5%8A%9F%E8%83%BD%E9%80%89%E9%A1%B9)


## Yggdrasil API

根据 Authlib-Injector 的规范， Yggdrasil API 分为 authserver 和 sessionserver 两个部分。

### 基本约定

所有请求和响应均使用 json，编码统一使用 UTF-8。

需要将 Accept 设置为 application/json，Content-Type 设置为 application/json;charset=utf-8

### 数据模型

#### 角色档案

基本模型

```json

{
    "name":"角色名称",
    "id":"角色的 uuid",
    "properties":[
        // 角色的属性，以列表提供，
    ]
}


```

列表中每个项目都有 name 和 value。

目前已知的 name 有 textures 和 uploadableTextures，分别包含了材质信息和可上传材质。

uploadableTextures 如果只有 skin 则只能上传皮肤，只有 cape 则只能上传披风，两者都有则皮肤、披风均可上传。


示例

```json

{
            "name":"LuoTianyi",
            "id":"26e6d239b6d14c8186e5137be904f856",
            "properties":[
                {
                    "name":"textures",
                    "value":"ewogICAgInRpbWVzdGFtcCI6MTc0MTMyMTk5MCwKICAgICJwcm9maWxlSWQiOiIyNmU2ZDIzOWI2ZDE0YzgxODZlNTEzN2JlOTA0Zjg1NiIsCiAgICAicHJvZmlsZU5hbWUiOiJMdW9UaWFueWkiLAogICAgInRleHR1cmVzIjp7CiAgICAgICAgInVybCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3lnZ2RyYXNpbC9wcm9maWxlcy91c2VyLzI2ZTZkMjM5YjZkMTRjODE4NmU1MTM3YmU5MDRmODU2L3RleHR1cmVzL2UxYmRjZGU0ODJiYTg4NDljNWNlMTI3OTZmNzMwY2I5YTAyOGI2NTg3NjcxMDQ4YzVhNjBlYmRhZGFiNGQwZGYiLAogICAgICAgICJtZXRhZGF0YSI6ewogICAgICAgICAgICAibW9kZWwiOiJzaWxtIgogICAgICAgIH0KICAgIH0KfQ=="
                },
                {
                    "name":"uploadableTextures",
                    "value":["skin","cape"]
                }
            ]
        }

```

### 用户信息档案

基本模型

```json

{
	"id":"用户名",
    "properties":[
	    // 用户属性
    ]
}

```

同样包含 name 和 value。

name 目前已知的只有一项，名为 preferredLanguage，记录了用户偏好语言

示例


```json

{
	"id":"LuoTianyi",
    "properties":[
	    { 
		    "name":"preferredLanguage",
		    "value":"zh-CN",
	    }
    ]
}

```

### AuthServer 部分


#### 登录

```http

POST /authserver/authenticate

```

##### 示例

提交数据为

```json

{
	"username":"邮箱/用户名",
	"password":"密码",
	"clientToken":"可选，由客户端随机生成",
	"requestUser":true/false, // 是否在响应中包含用户信息，默认 false
	"agent":{
		"name":"Minecraft",
		"version":1
	}
}

```

响应示例为

```json

{
	"accessToken":"26e6d239b6d14c8186e5137be904f856",
	"clientToken":"26e6d239b6d14c8186e5137be904f856",
    // 用户可用的角色，若数量不为 1 则需要用户选择角色后通过刷新登录绑定令牌到角色
    "availableProfiles":[
		{
            "name":"LuoTianyi",
            "id":"26e6d239b6d14c8186e5137be904f856",
            "properties":[
                {
                    "name":"textures",
                    "value":"ewogICAgInRpbWVzdGFtcCI6MTc0MTMyMTk5MCwKICAgICJwcm9maWxlSWQiOiIyNmU2ZDIzOWI2ZDE0YzgxODZlNTEzN2JlOTA0Zjg1NiIsCiAgICAicHJvZmlsZU5hbWUiOiJMdW9UaWFueWkiLAogICAgInRleHR1cmVzIjp7CiAgICAgICAgInVybCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3lnZ2RyYXNpbC9wcm9maWxlcy91c2VyLzI2ZTZkMjM5YjZkMTRjODE4NmU1MTM3YmU5MDRmODU2L3RleHR1cmVzL2UxYmRjZGU0ODJiYTg4NDljNWNlMTI3OTZmNzMwY2I5YTAyOGI2NTg3NjcxMDQ4YzVhNjBlYmRhZGFiNGQwZGYiLAogICAgICAgICJtZXRhZGF0YSI6ewogICAgICAgICAgICAibW9kZWwiOiJzaWxtIgogICAgICAgIH0KICAgIH0KfQ=="
                },
                {
                    "uploadableTextures":["skin","cape"]
                }
            ]
        }
	],
    // 一般如果这个值存在，则令牌将绑定到这个角色
	"selectedProfile":{
		{
            "name":"LuoTianyi",
            "id":"26e6d239b6d14c8186e5137be904f856",
            "properties":[
                {
                    "name":"textures",
                    "value":"ewogICAgInRpbWVzdGFtcCI6MTc0MTMyMTk5MCwKICAgICJwcm9maWxlSWQiOiIyNmU2ZDIzOWI2ZDE0YzgxODZlNTEzN2JlOTA0Zjg1NiIsCiAgICAicHJvZmlsZU5hbWUiOiJMdW9UaWFueWkiLAogICAgInRleHR1cmVzIjp7CiAgICAgICAgInVybCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3lnZ2RyYXNpbC9wcm9maWxlcy91c2VyLzI2ZTZkMjM5YjZkMTRjODE4NmU1MTM3YmU5MDRmODU2L3RleHR1cmVzL2UxYmRjZGU0ODJiYTg4NDljNWNlMTI3OTZmNzMwY2I5YTAyOGI2NTg3NjcxMDQ4YzVhNjBlYmRhZGFiNGQwZGYiLAogICAgICAgICJtZXRhZGF0YSI6ewogICAgICAgICAgICAibW9kZWwiOiJzaWxtIgogICAgICAgIH0KICAgIH0KfQ=="
                },
                {
                    "uploadableTextures":["skin","cape"]
                }
            ]
        }
	},
    // 仅在 requestUser 为 true 时提供
	"user":{
		"id":"LuoTianyi",
	    "properties":[
		    { 
			    "name":"preferredLanguage",
			    "value":"zh-CN",
		    }
	    ]
	}
}
```

在这个示例中，用户具有 1 个角色，名为 LuoTianyi，uuid 为 26e6d239b6d14c8186e5137be904f856。

selectedProfile 不为空，则令牌 26e6d239b6d14c8186e5137be904f856 将绑定到 LuoTianyi 这个角色上。

:::warning

当令牌被绑定到角色上后，这个令牌就只能用于操作这个角色档案，尝试操作其他角色将从 API 收到 403 响应

:::

在 Python 的实现为

```python

import requests
import json

headers = {
    "Accept":"application/json",
    "Content-Type":"application/json;charset=utf-8"
}

login_data = {
    "username":"LuoTianyi",
    "password":"Testpassword",
    "agent":{
        "name":"Minecraft",
        "version":1
    }
}

response = requests.post(url="https://api.example.com/yggdrasil/authserver/authenticate",data=json.dumps(login_data),headers=headers)

login_result = response.json()

if login_result.get("selectedProfile",False):
    return login_result.get("accessToken"),login_result.get("selectedProfile")
else:
    return ask_user_select_profile()

```

#### 刷新令牌

```http

POST /authserver/refresh

```

##### 示例

提交的数据为

```json

{
	"accessToken":"26e6d239b6d14c8186e5137be904f856",
	"clientToken":"26e6d239b6d14c8186e5137be904f856", // 可选，建议不提供
	"requestUser":true/false, // 是否在响应中包含用户信息
	// 绑定角色用
    "selectedProfile":{
        "name":"LuoTianyi",
        "id":"26e6d239b6d14c8186e5137be904f856"
	}
}

```

响应示例

```json
{
	"accessToken":"26e6d239b6d14c8186e5137be904f856",
	"clientToken":"26e6d239b6d14c8186e5137be904f856",
	"selectedProfile":{
        {
            "name":"LuoTianyi",
            "id":"26e6d239b6d14c8186e5137be904f856",
            "properties":[
                {
                    "name":"textures",
                    "value":"ewogICAgInRpbWVzdGFtcCI6MTc0MTMyMTk5MCwKICAgICJwcm9maWxlSWQiOiIyNmU2ZDIzOWI2ZDE0YzgxODZlNTEzN2JlOTA0Zjg1NiIsCiAgICAicHJvZmlsZU5hbWUiOiJMdW9UaWFueWkiLAogICAgInRleHR1cmVzIjp7CiAgICAgICAgInVybCI6Imh0dHBzOi8vYXBpLmV4YW1wbGUuY29tL3lnZ2RyYXNpbC9wcm9maWxlcy91c2VyLzI2ZTZkMjM5YjZkMTRjODE4NmU1MTM3YmU5MDRmODU2L3RleHR1cmVzL2UxYmRjZGU0ODJiYTg4NDljNWNlMTI3OTZmNzMwY2I5YTAyOGI2NTg3NjcxMDQ4YzVhNjBlYmRhZGFiNGQwZGYiLAogICAgICAgICJtZXRhZGF0YSI6ewogICAgICAgICAgICAibW9kZWwiOiJzaWxtIgogICAgICAgIH0KICAgIH0KfQ=="
                },
                {
                    "uploadableTextures":["skin","cape"]
                }
            ]
        }
	},
	"user":{
		"id":"LuoTianyi",
	    "properties":[
		    { 
			    "name":"preferredLanguage",
			    "value":"zh-CN",
		    }
	    ]
	}
}
```

在示例中，我们将 26e6d239b6d14c8186e5137be904f856 这个令牌绑定到 LuoTianyi 这个角色上。


:::warning

Yggdrasil API 技术规范并没有指明新令牌必须和原令牌相同，所以请勿尝试重用旧令牌。

:::

代码示例

```python
import requests
import json

headers = {
    "Accept":"application/json",
    "Content-Type":"application/json;charset=utf-8"
}

login_data = {
    "accessToken":"26e6d239b6d14c8186e5137be904f856",
    "selectedProfile":{
        "name":"LuoTianyi",
        "id":"26e6d239b6d14c8186e5137be904f856"
    }
}

response = requests.post(url="https://api.example.com/yggdrasil/authserver/refresh",data=json.dumps(login_data),headers=header)

login_result = response.json()

if login_result.get("selectedProfile",False):
    return login_result.get("accessToken"),login_result.get("selectedProfile")
else:
    return login_result.get("accessToken"),{}
```

#### 验证接口

```http
POST /authserver/refresh
```

#### 吊销令牌

通过此 API，可以将当前的访问令牌设置为无效，从而实现登出启动器的功能。

```http
POST /authserver/invalidate
```

#### 登出

通过此 API，所有先前被颁发的访问令牌将被吊销，从而实现退出多个客户端的账号。

```http
POST /authserver/signout
```