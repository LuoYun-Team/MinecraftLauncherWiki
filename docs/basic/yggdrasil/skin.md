# 1.5.2 修改皮肤和披风

## 皮肤

上传皮肤

```http
PUT /api/user/profile/<uuid>/<textureType>
```

将 Content-Type 设置为 multipart/form-data;image/png

请求载荷：

```http
model=""&file=
```