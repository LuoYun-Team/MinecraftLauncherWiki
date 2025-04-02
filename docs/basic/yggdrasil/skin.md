# 1.5.2 修改皮肤和披风

## 皮肤/披风

上传

```http
PUT /api/user/profile/<uuid>/<textureType>
```

将 Content-Type 设置为 multipart/form-data;image/png

请求载荷：

```http
model=""&file=/home/boximengling/.minecraft/authlib-injector/.cache/skin.png
```

重置

```http
DELETE /api/user/profile/<uuid>/<textureType>
```