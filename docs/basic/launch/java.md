# 1.8.2 自动下载 Java

众所周知，Minecraft 是个用 Java 写的跨平台游戏。

又众所周知，Java 不能生成传统意义上的二进制文件，只能带个 JRE ~~（不然启动器不就没有存在的意义了么？）~~。

这一章是启动游戏的第二个部分，再过一个部分，我们就能启动游戏了！

## 获取 Java 列表

事实上 Mojang 也考虑到了这一点，所以 Mojang 也提供了 Java 的版本列表。

你也可以选择自建服务器来提供 Java（不推荐），或者使用其他产商的高版本 Java

如果选择从 Mojang下载，你只需要。

```http
GET https://piston-meta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json
```

就能拿到 Mojang 存储的 Java。

现阶段 Mojang 一共存储了 4 种版本的 Java。

- Java 8u51，适配版本： 正式版 1.0~1.16.5，快照版 21w18a 及以前，和全部的远古版。

不建议用在带有 Forge 等加载器的版本，有些 Mod 和 8u51 兼容性也不好。

第三方登录至少需要 8u101 及以上才能正常登录。

- Java 16.0.1，适配版本：正式版 1.17，快照版 21w19a~1.18.2-Pre1

- Java17.0.8，适配版本：正式版 1.18~1.20.4 快照版 1.18.2-Pre2~24w13a

- Java 21.0.3，适配版本：正式版 1.20.5 及以后的版本 快照版 24w14a 及以后的版本。

## 获取 Minecraft 适用的 Java 版本

虽然可以通过版本范围确定适用版本，不过多少有点不优雅。

好在 Mojang 在版本 Json 记录了适用版本。

例如 25w06a 的 Json 文件。

```json
"javaVersion": {
    "component":"java-runtime-delta",
    "majorVersion": 21
    }
```

指定了 Java 21 为最低启动版本。

:::warning 注意一下

有个特殊的版本需要特别对待，就是 1.6.1-1.7.2 且安装了 Forge 的版本。

Forge 在此版本编写的代码和 Java 8 有冲突，只能使用 Java 7 启动。

解决方案是在 Mods 文件夹加入[这个文件](https://maven.minecraftforge.net/net/minecraftforge/lex/legacyjavafixer/1.0/legacyjavafixer-1.0.jar)

:::

## 下载对应文件

现在你知道了需要下载什么样的版本了，你要获取系统名称来下载对应架构的 Java，这里我们为了省事直接用 windows-x64 + jre-legacy 来演示如何下载。

需要注意的是 jre-legacy 键值后面是列表，需要提取第二个的值。

下载列表后，提取列表的 files 键值，随后遍历列表内的值，其中键名为相对下载路径，值为下载信息。

downloads 键下分为 lzma 和 raw，分别是压缩后的文件和未压缩的文件。

如果启动器有能力解压 lzma 文件，通过 lzma 下载可以提高下载速度（因为文件小了），否则只能通过 raw 下载。


:::tip

以下文件存在大量重复，请自行考虑是否需要复用缓存（或者跳过）

`12976a6c2b227cbac58969c1455444596c894656` `c80e4bab46e34d02826eab226a4441d0970f2aba` `84d2102ad171863db04e7ee22a259d1f6c5de4a5`

:::