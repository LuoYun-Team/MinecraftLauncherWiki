# 1.8.3 拼接启动参数

在这一章，我们将讲解如何拼接参数和启动游戏

作为游戏和资源分开存储的游戏，自然需要处理 JVM 启动参数。

Minecraft 启动参数分为四个部分。

- Java 路径

- JVM 参数

- 主类和 ClassPath

- Minecraft 游戏参数

## Java 路径

顾名思义，就是 Java 可执行文件所在位置，java.exe 或者 javaw.exe 均可。

例如

```bash
/usr/local/openjdk/jdk-17/bin/java
```

这部分为游戏参数的开头，需要确保文件存在

## JVM 参数


:::warning

所有带空格的参数均要在参数前后加双引号，否则极有可能看到这样的报错：

```log
[ERROR] 错误：找不到或无法加载主类 "10"
```

:::

### -X、-XX 参数

-Xmx2048M，指定 JVM 最大使用内存为 2048 MB，也可以改为使用 -Xmx16G 这样。

-Xms384M，指定 JVM 最小内存为 256 MB，同样可以写成 -Xms1G

-Xmn256M，指定了 JVM 新生代堆栈大小，为 256 MB

-XX:+UseG1GC，使用 G1 作为全局 GC

-XX:-UseAdaptiveSizePolicy，自动选择年轻代区大小和相应的Survivor区比例。

-XX:-OmitStackTraceInFastThrow，省略异常栈信息从而快速抛出。

### JVM 属性

-Dos.name="Windows 10"，将操作系统名称设置为 Windows 10

-Dos.version=10.0，将操作系统版本设置为 10.0

-Dlog4j.configurationFile=/home/boximengling/.minecraft/natives/1.19.2/log4j/log4j2.xaml

设置 log4j2 配置文件地址。

-Djava.library.path=/home/boximengling/.minecraft/natives/1.19.2/local

设置 Natives 文件所在目录

## classpath 和主类

以 -cp 为起始，后接游戏支持库，Windows 下每个文件以 ; 分隔，其他平台使用 :

例如 -cp /home/boximengling/.minecraft/libraries/org/apache/log4j/log4j2/2.22.0/log4j2-2.22.0.jar:/home/boximengling/.minecraft/libraries/org/apache/log4j/log4j2-core/2.9.0/log4j2-core-2.9.0.jar

主类由 Minecraft 版本文件提供，原版为 net.minecraft.client.main.Main，带 Mod 加载器的一般是 net.minecraft.launchwrapper.Launch（或者加载器自定义主类），服务端主类为 net.minecraft.server.main

## Minecraft 参数

--demo 试玩模式，此参数下启动的游戏会以试玩模式启动。

--assetsDir assets 目录，例如 --assetsDir /home/boximengling/.minecraft/assets。

--assetIndex assets 索引，参考 [Minecraft 中文 Wiki 的解释](https://zh.minecraft.wiki/w/%E6%95%A3%E5%88%97%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6#%E8%B5%84%E6%BA%90%E7%B4%A2%E5%BC%95)

--gameDir 游戏目录，非版本隔离下为 .minecraft 根目录，版本隔离下为版本文件夹根目录。

--username 指定游戏用户名，比如 --username boximengling。

--accessToken Minecraft 访问令牌，正版/第三方登录需要，离线模式随意。

--userType 指定用户类型，可选值为 mojang 或 msa

--uuid Minecraft 玩家 UUID，根据验证服务器所提供的档案决定，离线模式根据用户名生成。

--width 指定窗口宽度。

--height 指定窗口高度。

--server 多人游戏服务器地址，旧版本需要额外指定 --port 参数，例如 192.168.7.12:25565（新版） 或者 192.168.7.12（旧版）

--port （旧版参数）指定多人游戏服务器端口，默认情况下 Minecraft Java 版使用 25565 作为服务器端口。

完成上述部分后，便可通过系统 API 来拉起进程启动游戏了。