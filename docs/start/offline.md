# 1.4 离线登录

::: warning

在未验证用户是否持有合法且有效的 Minecraft 副本前为其开放离线登录选项与美国和欧盟等国家的版权法相冲突。此做法会被 DMCA（数字千年版权法） 等法律视为侵犯版权，是一种违法行为！

如果你的启动器计划进行国际化，请务必验证用户是否持有合法且有效的 Minecraft 副本！这可以避免给你和你的用户带来法律责任！

:::


离线登录并不需要通过 Minecraft 在线服务 API 完成，因此代码非常简单。

UUID 生成算法可使用不易重复的 UUIDv4/v7 或可实现启动器切换的 UUIDv3 + Bukkit 算法。

这里以 UUIDv3 + Bukkit 算法为例。

```python

import uuid

def login_offline(username:str):
    return str(uuid.uuid3(uuid.NAMESPACE_DNS,f"OfflinePlayer:{username}")).replace("-","")

```