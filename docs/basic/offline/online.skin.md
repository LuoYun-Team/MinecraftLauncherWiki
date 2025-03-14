# 1.4.3 使用正版玩家的皮肤

:::warning 不建议实现的功能

经过调查， 1.20+ 和快照版在使用此功能可能导致无法正常保存世界和使用指令。

如果确实想实现这个功能，建议配合 [1.4.2 可更换皮肤的离线登录](./yggdrasil.md) 使用。

:::

这是继 1.4.2 后第二个可以在游戏中显示皮肤的功能.jpg

Minecraft 材质信息并不需要登录就能下载，所以你只需要使用正版账号的 UUID 即可获取这个正版账号的皮肤。

那么如何获取 UUID 呢？

其实 Minecraft 档案信息有一些允许匿名查询的内容，其中就包括 UUID。

```http
GET https://api.minecraftservices.com/users/profiles/minecraft/<游戏用户名>
```

:::tip Mojang API 的旧地址

以下是此 API 的旧地址

```http
GET https://api.mojang.com/users/profiles/minecraft/<游戏用户名>
```

:::


## 下载材质（可选）

如果很喜欢这个皮肤，也可以选择下载这个皮肤，只需要通过以下 API 就能获取材质下信息。

```http
GET https://sessionserver.mojang.com/session/minecraft/profile/<档案的 UUID>
```

```json
{
  "id" : "<档案 UUID>",
  "name" : "<玩家名>",
  "properties" : [ {
    "name" : "textures",
    "value" : "<base64 编码的材质信息>"
  } ],
  "profileActions" : [ ]
}
```

将 value 解码，会得到一串 json 信息

```json
{
  "timestamp" : ,
  "profileId" : "<uuid>",
  "profileName" : "<玩家名>",
  "textures" : {
    "SKIN" : {
      "url" : "http://textures.minecraft.net/texture/xxxxxxxx", // 材质信息
      "metadata" : {
        "model" : "slim" // 皮肤模型
      }
    }
  }
}
```

其中的 url 便是材质的下载地址。