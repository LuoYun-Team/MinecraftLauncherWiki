import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minecraft 启动器开发指北",
  description: "Minecraft 启动器开发指北",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "开始之前", link: "/before/before" }
    ],

    sidebar: [
      {
        text: "开始之前",
        items: [
          { text: "0.1 开始之前需要注意的事项", link: "/before/before" },
          { text: "0.2 基本启动原理与开发语言选择", link: "/before/prepare" }
        ]
      },
      {
        text: "基础功能",
        items: [
          { text: "1.0 基础功能实现",link:"/basic/"},
          { text: "1.1 获取游戏版本", link: "/basic/getversion" },
          { text: "1.2 处理游戏文件", link: "/basic/file" },
          { text: "1.3 使用镜像源下载文件", link: "/basic/mirror" },
          { text: "1.4 离线登录", link: "/basic/offline" },
          { text: "1.5 第三方登录", link: "/basic/yggdrasil" },
          { text: "1.6 正版登录", link: "/basic/msauth"}
        ]
      },
      {
        text: "高阶功能",
        items: [
          { text: "2.0 高阶功能介绍", link: "/advance/index" },
          { text: "2.1 Yggdrasil Connect 协议", link: "/advance/yggdrasil-connect" },
          { text: "2.2 各类 Mod 加载器的安装", link: "/advance/modloader" },
          { text: "2.3 Mod 下载", link: "/advance/mod" },
          { text: "2.4 整合包下载", link: "/advance/modpack" },
          { text: "2.5 资源包下载", link: "/advance/resourcepack"}
        ]
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" }
    ]
  }
})
