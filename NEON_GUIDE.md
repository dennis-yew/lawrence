# Neon 数据库配置指南

本项目使用 [Neon](https://neon.tech) 作为 PostgreSQL 云数据库。Neon 提供了免费的 PostgreSQL 数据库，具有无服务器扩展功能和分支特性。

## 数据库配置

1. **环境变量设置**

   项目使用 `.env` 文件中的 `DATABASE_URL` 变量来连接数据库：

   ```
   DATABASE_URL="postgresql://neondb_owner:你的密码@ep-xxxxx-pooler.区域.aws.neon.tech/neondb?sslmode=require"
   ```

   当前配置使用的是亚太东南1区域 (ap-southeast-1)。

2. **数据库初始化**

   首次使用前，请运行以下命令检查数据库连接并验证表结构：

   ```bash
   npm run db:init
   ```

   如果需要创建或更新数据库表结构，运行：

   ```bash
   npm run db:push
   ```

## 常见问题排查

如果遇到数据库连接问题，请检查：

1. **连接字符串是否正确**
   - 确保密码和主机名正确
   - 检查区域设置是否匹配你的 Neon 项目区域

2. **网络连接**
   - Neon 需要有效的互联网连接
   - 某些网络可能会阻止数据库连接端口

3. **IP 限制**
   - 在 Neon 控制台中检查是否启用了 IP 限制
   - 如果启用，确保将你的 IP 地址添加到允许列表

## 数据库管理

你可以通过 Neon 控制台进行数据库管理：

1. 访问 [console.neon.tech](https://console.neon.tech)
2. 登录你的账户
3. 选择你的项目
4. 使用内置的 SQL 编辑器运行查询

也可以使用任何支持 PostgreSQL 的客户端工具（如 pgAdmin、DBeaver 等）连接到你的 Neon 数据库。

## 分支功能

Neon 的一个强大特性是数据库分支功能。你可以为开发、测试或功能分支创建单独的数据库副本：

1. 在 Neon 控制台中创建新分支
2. 获取新分支的连接字符串
3. 在开发环境中使用新的连接字符串

这样可以避免开发过程中破坏生产数据。

## 资源限制

请注意 Neon 免费计划的限制：

- 每个项目最多 10GB 存储
- 自动休眠未使用的连接
- 有限的计算资源

对于生产环境，建议升级到付费计划。

## 更多帮助

如需更多帮助，请参考：
- [Neon 官方文档](https://neon.tech/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Drizzle ORM 文档](https://orm.drizzle.team/docs/overview) 