# 1.4.1 标准离线登录

标准离线登录并不需要通过 Minecraft 在线服务 API 完成，因此代码非常简单。

UUID 生成算法可使用不易重复的 UUIDv4/v7 或可实现启动器切换的 UUIDv3 + Bukkit 算法。

这里以 UUIDv3 + Bukkit 算法为例。

```python
import uuid

def login_offline(username:str):
    return str(uuid.uuid3(uuid.NAMESPACE_DNS,f"OfflinePlayer:{username}")).replace("-","")
```