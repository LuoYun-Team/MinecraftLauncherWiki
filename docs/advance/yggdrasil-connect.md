# 2.1 Yggdrasil Connect 协议

:::warning

本文档所描述的内容和实现方式可能与协议规范有所出入，只作为参考开发使用

:::


## 协议介绍

Yggdrasil Connect 是基于 OpenID Connect 协议扩展实现的一种全新认证协议，其目的是为了取代 Yggdrasil API 的 AuthServer 部分，并在全平台提供统一且安全的身份认证平台。

## 为什么需要这个协议

传统 Yggdrasil API 在登录部分上存在缺陷，认证需要启动器直接处理用户名和密码，并通过 HTTP(S) 协议发送，直接增加了密码泄露的风险，且此 API 在设计上未考虑过适配多因素身份认证（MFA）,无法良好地保障用户的账号安全。

为了解决这一问题，Mojang 宣布将现有账号转移至 Microsoft 账号，利用 Microsoft 账号自带的多因素身份认证体系提供安全服务，并利用 Microsoft 成熟的 OAuth 认证系统（Microsoft Entra ID）来提供全平台统一且安全的身份认证体验。

## 如何发现认证服务

和 OpenID Connect 一样，Yggdrasil Connect 也提供了发现认证服务，其依赖于 Yggdrasil API 的元数据。

```json
{
    {
  "meta": {
    "serverName": "Example Yggdrasil Server",
    "implementationName": "Yggdrasil",
    "implementationVersion": "0.0.1",
    "links": {
      "announcement": "https://api.example.com/announcements",
      "homepage": "https://yggdrasil.example.com",
      "register": "https://yggdrasil.example.com/user/auth/register"
    },
    "feature.non_email_login": true,
    "feature.openid_configuration_url": "https://api.example.com/.well-known/openid-configuration"
  },
  "skinDomains": [
    "api.example.com"
  ],
  "signaturePublickey": "···"
}
}
```

其中的 `feature.openid_configuration_url` 即是发现认证服务的关键，应用程序需要提取这个字段并向其发送 HTTP 请求来获取配置文件。

## 认证服务配置文件

```json
{
  "issuer": "https://open.yggdrasil.example.com",
  "jwks_uri": "https://open.yggdrasil.example.com/.well-known/jwks",
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256",
    "PS256",
    "ES256",
    "EdDSA"
  ],
  "claim_types_supported": [
    "normal"
  ],
  "claim_parameter_supported": false,
  "claims_supported": [
    "sub",
    "iss",
    "iat",
    "exp",
    "aud",
    "selectedProfile",
    "availableProfiles"
  ],
  "scopes_supported": [
    "openid",
    "offline_access",
    "Yggdrasil.PlayerProfiles.Select",
    "Yggdrasil.PlayerProfiles.Read",
    "Yggdrasil.MinecraftToken.Create",
    "Yggdrasil.Server.Join"
  ],
  "device_authorization_endpoint": "https://api.example.com/oauth/device_code",
  "token_endpoint": "https://api.example.com/oauth/token",
  "userinfo_endpoint": "https://api.example.com/oauth/userinfo",
  "request_parameter_supported": false,
  "request_uri_parameter_supported": false
}
```

因为 Yggdrasil Connect 只是扩展了 OpenID Connect 的实现，而对 OpenID Connect 的核心部分————OAuth 认证系统几乎和 Microsoft OAuth 没有区别，因此可将其视为符合 RFC 8628 的 OAuth