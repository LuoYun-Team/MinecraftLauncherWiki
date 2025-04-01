# 1.7.2 皮肤修改与披风更换

在 1.7.1 中我们讲解了怎么获取 Minecraft 访问令牌。

作为访问令牌，其作用显然没有启动游戏这么简单。

通过这个令牌，我们可以帮助用户完成一些不太方便完成的操作，例如访问在线服务 API。

## 修改皮肤

```http
POST https://api.minecraftservices.com/minecraft/profile/skins
```

需要将 Authorization 头设置为 Bearer <Minecraft 访问令牌>。

载荷数据由两部分组成，分别是 model 和 file。

其中 model 决定模型，其值为空时为 Steve 模型，为 slim 时，该皮肤为 Alex 模型。

:::warning

选择不恰当的模型（例如将 Alex 模型的皮肤作为 Steve 模型上传）会得到部分发黑的人物模型，请在上传之前询问用户以确认具体模型。

:::

数据示例：

```http
model=silm&file=/home/boximengling/.minecraft/Skin/Minecraft/03.png
```

## 修改披风

因为官方不允许玩家自行上传披风，这里只提供切换披风的方式。


使用披风：

```http
PUT https://api.minecraftservices.com/minecraft/profile/capes/active
```

取消使用披风：

```http
DELETE https://api.minecraftservices.com/minecraft/profile/capes/active
```

需要附加的数据:

如果选择使用，从用户档案获取可用披风信息。

将请求头中的 Authorization 字段设置为 Beraer <Minecraft 访问令牌>。

然后根据用户选择获取 capeId。

构建如下数据：

```json
{
    "capeId":"<对应的 capeId>"
}
```

如果是取消使用，则数据载荷为空字符串。