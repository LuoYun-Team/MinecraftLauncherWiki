# 1.1 获取游戏版本

所谓要致富，先撸树。

先得拿到版本列表才能下载版本，然后启动游戏，才有后续，不然启动什么？空气吗？

But？从哪里拿版本列表呢？

## 版本列表获取

众所周知，官启能下载多个版本且不需要更新启动器，所以必然有个地方存了版本列表。

这个地方是 Mojang 的 API。

也就是这个地址。

```
https://piston-meta.mojang.com/mc/game/version_manifest.json
//或者
https://piston-meta.mojang.com/mc/game/version_manifest_v2.json
```

::: tip

使用 HTTP 协议访问 Mojang API 会返回 400/502 响应，详见[Hex-Dragon/PCL2#964](https://github.com/Hex-Dragon/PCL2/issues/964)

:::


::: tip
以下地址为 Mojang 使用的旧地址。

https://launchermeta.mojang.com/mc/game/version_manifest.json

:::

列表大概长这个样子

```json
{
    "latest":{
        "release": "",//最新正式版
        "snapshot":"" //最新快照版
    },
    "versions": [
        {
        "id":"", //游戏版本号
        "type":"", //游戏类型
        "url":"", //版本 Json 对应地址
        "time":"", //最近一次 Mojang 对其做出更改的时间
        "releaseTime":"", //游戏发行时间
        "sha1":"", //版本 Json 的哈希（SHA1 算法），校验用（v2 特有）
        "complianceLevel":"" //暂不清楚作用，但似乎不会用到这个（v2 特有）
        }
        // 后面一长串都是这样的内容
    ]
}
```

我们要做的就是下载这个列表，然后保存并解析。

示例代码

```python
# 这里使用第三方库 requests，你也可以换成 aiohttp/httpx/urllib/http ，但是不同库使用方法不同
import request as r

versions = {}

version_list = []

headers = {
    "User-Agent":"" # 改成启动器使用的用户代理
    # 可以在这自行增加标头，不过过多标头可能造成额外开销
    # 非标准标头前缀需要有 X-，例如 X-Launcher-Version ，参考 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers
}

# 向 API 发送 Get 请求来获取内容
# 可以通过传入 headers 来指定请求头
resp = r.get(url="https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"，headers=hreaders)

# 实际代码需要检查状态码是否为 200
# 将内容转换为字典格式
jobject = resp.json()

for version in jobject["versions"]:
    # 独立维护一份版本列表用于获取索引
    version_list.append(version["id"])
    # 版本预分类
    # match case 表达式是 3.10+ 特性，如果需要兼容旧版本只能用 if else 表达式
    match version.get("type","nothing").lower():
        case "release":
            version["type"] = "正式版"
        case "snapshot":
            match version.get("id","nothing").lower():
                case "20w14infinite", "20w14∞":
                    version["id"] = "20w14∞"
                    version["type"] = "愚人节版本"
                case "3d shareware v1.34", "1.rv-pre1", "15w14a", "2.0", "22w13oneblockatatime", "23w13a_or_b", "24w14potato":
                    version["type"] = "愚人节版本"
                case "nothing":
                    # 可根据需要调整代码
                    continue
                case _:
                    version["type"] = "快照版"
        # 可根据需要调整代码
        case "nothing":
            continue
        case _:
            continue

            
    # 构建版本列表
    # 你可以根据实际需要增加或减少内容
    versions[version.get("id")] = {
        "url":version.get("url"),
        "sha1":version.get("sha1"),
        "releaseTime":version.get("releaseTime"),
        "type": version.get("type")
    }




```

至此 versions 的内容便是我们所需要的版本列表。