# 1.2 处理游戏文件

上一章我们解决了版本列表获取问题，这一章来解决游戏文件的处理问题。

还记得我们上一章构建的版本列表么？我们需要通过这个列表获取内容。

先来看看 Json 结构

## 1.21
```json
{

  "arguments": {
    "game": [
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
      {
        "rules": [
          {
            "action": "allow",
            "features": {
              "is_demo_user": true
            }
          }
        ],
        "value": "--demo"
      },
      {
        "rules": [
          {
            "action": "allow",
            "features": {
              "has_custom_resolution": true
            }
          }
        ],
        "value": [
          "--width",
          "${resolution_width}",
          "--height",
          "${resolution_height}"
        ]
      },
      {
        "rules": [
          {
            "action": "allow",
            "features": {
              "has_quick_plays_support": true
            }
          }
        ],
        "value": [
          "--quickPlayPath",
          "${quickPlayPath}"
        ]
      },
      {
        "rules": [
          {
            "action": "allow",
            "features": {
              "is_quick_play_singleplayer": true
            }
          }
        ],
        "value": [
          "--quickPlaySingleplayer",
          "${quickPlaySingleplayer}"
        ]
      },
      {
        "rules": [
          {
            "action": "allow",
            "features": {
              "is_quick_play_multiplayer": true
            }
          }
        ],
        "value": [
          "--quickPlayMultiplayer",
          "${quickPlayMultiplayer}"
        ]
      },
      {
        "rules": [
          {
            "action": "allow",
            "features": {
              "is_quick_play_realms": true
            }
          }
        ],
        "value": [
          "--quickPlayRealms",
          "${quickPlayRealms}"
        ]
      }
    ],
    "jvm": [
      {
        "rules": [
          {
            "action": "allow",
            "os": {
              "name": "osx"
            }
          }
        ],
        "value": [
          "-XstartOnFirstThread"
        ]
      },
      {
        "rules": [
          {
            "action": "allow",
            "os": {
              "name": "windows"
            }
          }
        ],
        "value": "-XX:HeapDumpPath=MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump"
      },
      {
        "rules": [
          {
            "action": "allow",
            "os": {
              "arch": "x86"
            }
          }
        ],
        "value": "-Xss1M"
      },
      "-Djava.library.path=${natives_directory}",
      "-Djna.tmpdir=${natives_directory}",
      "-Dorg.lwjgl.system.SharedLibraryExtractPath=${natives_directory}",
      "-Dio.netty.native.workdir=${natives_directory}",
      "-Dminecraft.launcher.brand=${launcher_name}",
      "-Dminecraft.launcher.version=${launcher_version}",
      "-cp",
      "${classpath}"
    ]
  },
  //资源文件索引
  "assetIndex": {
    //资源文件版本，低版本是其继承版本，例如 1.12.2 的继承版本是 1.12
    // 自 22w45a 开始改为从 1 起递增的数字
    "id": "17", 
    "sha1": "7cedb23305a218c4d1a58d27e7ad8a86ee495d48",
    "size": 448567,
    "totalSize": 802542178,
    //资源文件索引
    "url": "https://piston-meta.mojang.com/v1/packages/7cedb23305a218c4d1a58d27e7ad8a86ee495d48/17.json"
  },
  "assets": "17",
  "complianceLevel": 1,
  "downloads": {
    // 客户端下载信息
    "client": {
      "sha1": "0e9a07b9bb3390602f977073aa12884a4ce12431",
      "size": 26836080,
      "url": "https://piston-data.mojang.com/v1/objects/0e9a07b9bb3390602f977073aa12884a4ce12431/client.jar"
    },
    // 混淆映射表，现阶段暂时无用，等到 Mod 加载器那部分有用
    "client_mappings": {
      "sha1": "0530a206839eb1e9b35ec86acbbe394b07a2d9fb",
      "size": 9597156,
      "url": "https://piston-data.mojang.com/v1/objects/0530a206839eb1e9b35ec86acbbe394b07a2d9fb/client.txt"
    },
    // 原版服务端
    "server": {
      "sha1": "450698d1863ab5180c25d7c804ef0fe6369dd1ba",
      "size": 51623779,
      "url": "https://piston-data.mojang.com/v1/objects/450698d1863ab5180c25d7c804ef0fe6369dd1ba/server.jar"
    },
    // 服务端的映射表
    "server_mappings": {
      "sha1": "31c77994d96f05ba25a870ada70f47f315330437",
      "size": 7454609,
      "url": "https://piston-data.mojang.com/v1/objects/31c77994d96f05ba25a870ada70f47f315330437/server.txt"
    }
  },
  "id": "1.21", // 版本号
  "javaVersion": {
    "component": "java-runtime-delta", //Mojang Java 名称
    // 要求的 Java 版本
    "majorVersion": 21
  },
  "libraries": [
    {
      "downloads": {
        "artifact": {
          "path": "", //文件存储路径
          "sha1": "", //文件 SHA1
          "size": , //文件大小
          "url": "" //下载地址
        }
      },
      "name": "ca.weblite:java-objc-bridge:1.1", //对于启动没有什么帮助
      "rules": [
        // 不同操作系统是否可以使用此文件
        {
          "action": "allow",
          "os": {
            "name": "osx"
          }
        }
      ]
    }
  ],
  // log4j2 配置文件
  "logging": {
    "client": {
      "argument": "-Dlog4j.configurationFile=${path}",
      "file": {
        "id": "client-1.12.xml",
        "sha1": "bd65e7d2e3c237be76cfbef4c2405033d7f91521",
        "size": 888,
        "url": "https://piston-data.mojang.com/v1/objects/bd65e7d2e3c237be76cfbef4c2405033d7f91521/client-1.12.xml"
      },
      "type": "log4j2-xml"
    }
  },
  // 主类名
  "mainClass": "net.minecraft.client.main.Main",
  "minimumLauncherVersion": 21,
  "releaseTime": "2024-06-13T08:24:03+00:00",
  "time": "2024-06-13T08:24:03+00:00",
  "type": "release"
}
```

低版本会在 native 部分包含 classifiers，这个是实际的 natives 文件，需要下载下来然后解压。

我们需要注意其中的 assetsIndex 和 libraries，这两个部分包含了游戏资源文件和支持库（包括 native 文件）文件，需要下载下来，高版本会自行解压，无需启动器处理。

libraries 倒是很好下载，因为 url 和 path 都提供好了，主要还是资源文件问题

## 获取资源文件的下载地址

首先基本下载地址是

```http
https://resources.download.minecraft.net
```

然后以此为基础，第一个目录是文件 sha1 的前两位，例如。

```http
https://resources.download.minecraft.net/a7
```

随后以此为基础，叠加文件 sha1 就能得到真正的下载地址。

保存路径也是一样的，在 /assets/objects 建立对应的文件夹即可。

资源索引文件需要保存在 /assets/indexes/<资源索引对应的版本>，并且启动器需要时不时的更新一下。


```python

# 这段代码我没实际测试过，所以可能逻辑上就转不起来，仅供实现思路参考

import requests as r

# 这里以 1.21 为例，但实际使用时应当让用户自行选择版本
version = "1.21"

# 提取版本 Json 地址
version_url = versions[version]["url"]

# 获取文件
resp = r.get(url=version_url,headers=headers)

# 将 filepath 替换为实际路径
# 指定为写入（w）和字节模式（b）
with open(filepath,"wb") as f:
    f.write(resp.content)

# 由于未知原因，在 with 块内进行文件校验始终会出现小部分文件总是校验失败的问题


# 此处 checkfile 需要替换为自行实现的校验函数
if not checkfile(filepath,versions[version]["sha1"],versions[version]["size"]):
    raise RuntimeError("文件校验失败")

# 创建一个字典存储要下载的文件和对应 hash
download_files = {}

version_json = resp.json()

resp = r.get(url=version_json["assetsIndex"]["url"],headers=headers)

with open(filepath,"wb") as f:
    f.write(resp.content)

if not checkfile(filepath,version_json["assetsIndex"]["sha1"],version_json["assetsIndex"]["size"]):
    raise RuntimeError("文件校验失败")

# 提取客户端文件
download_files[version_json["downloads"]["client"]["url"]] ={
    "sha1":client_hash_sha1 = version_json["downloads"]["client"]["sha1"]
    "path":filepath,
    "size":version_json["downloads"]["client"]["size"]
} 
# 支持库
for library in version_json["libraries"]:
    try:
        # 构建下载列表
        download_files[library["downloads"]["artifact"]["url"]] = {
            "sha1":library["downloads"]["artifact"]["sha1"],
            "path":f"{gameDir}/libraries/{library["downloads"]["artifact"]["path"]}",
            "size":version_json["downloads"]["artifact"]["size"]
        }
        download_files[library["downloads"]["classifiers"]["url"]] = {
            "sha1":library["downloads"]["classifiers"]["sha1"],
            "path":f"{gameDir}/libraries/{library["downloads"]["classifiers"]["path"]}",
            "size":"path":f"{gameDir}/libraries/{library["downloads"]["classifiers"]["size"]}"
                }
    except KeyError as e:
        # 高版本可能不存在此字段，或者块内本身就没有这个字段
        if "classifiers" in e:
            continue
        else:
            # 避免漏下支持库
            try:
                download_files[library["downloads"]["classifiers"]["url"]] = {
                    "sha1":library["downloads"]["classifiers"]["sha1"],
                    "path":f"{gameDir}/libraries/{library["downloads"]["classifiers"]["path"]}",
                    "size":"path":f"{gameDir}/libraries/{library["downloads"]["classifiers"]["size"]}"
                }
            except:
                # 真没有，跳过
                continue

res_index = resp.json()

for key,value in res_index["objects"].items():
    download_files[f"https://resources.download.minecraft.net/{res["hash"][0:2]/res["hash"]}"] = {
        "sha1":value["hash"],
        "size":value["size"],
        "legacy_path":f"{gameDir}/assets/virtual/legacy/{key}",
        "path":f"{gameDir}/assets/objects/{res["hash"][0:2]/res["hash"]"
    }

for url,meta in download_files:
    resp = r.get(url=url,headers=headers)
    if not url.startswith("https://resources.download.minecraft.net"):
        with open(meta["path"],"wb") as f:
            f.write(resp.content)
        if not checkfile(meta["path"],meta["sha1"],meta["size"]):
            raise RuntimeError("文件校验失败！")
    else:
        if versions[version]["type"] == "远古版":
            with open(meta["legacy_path"],"wb") as f:
                f.write(resp.content)
        with open(meta["path"],"wb") as f:
            f.write(resp.content)
        if not checkfile(meta["path"],meta["sha1"],meta["size"])
            raise RuntimeError("文件校验失败！")



```
