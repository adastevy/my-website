## ADDED Requirements

### Requirement: Provide aggregated learning statistics overview

系统 SHALL 提供 `GET /api/analytics/overview` 端点，返回当前认证用户的学习统计数据聚合。

返回字段 SHALL 包含：当日学习时长（today_hours）、进行中课程数（active_courses）、课程完成率（completion_rate）、连续学习天数（streak_days）、累计学习总时长（total_hours）、累计学习会话数（total_sessions）。

所有数值 SHALL 从 `learning_sessions` 和 `users` 表通过 SQL 聚合查询计算得出。

#### Scenario: Authenticated user requests overview

- **WHEN** 已认证用户发起 `GET /api/analytics/overview`
- **THEN** 返回 200，body 包含 today_hours、active_courses、completion_rate、streak_days、total_hours、total_sessions 六个字段

#### Scenario: Request without valid token

- **WHEN** 请求未携带或携带无效 Bearer token
- **THEN** 返回 401，body 包含 detail 错误信息

#### Scenario: New user with no learning data

- **WHEN** 已认证但无任何学习记录的用户请求 overview
- **THEN** 返回 200，所有数值字段为 0（today_hours=0, active_courses=0, completion_rate=0, streak_days=0, total_hours=0, total_sessions=0）

### Requirement: Provide monthly learning calendar data

系统 SHALL 提供 `GET /api/analytics/calendar` 端点，按年月返回用户每日学习时长。

请求 SHALL 接受 `year` 和 `month` 两个必需查询参数（均为正整数）。响应 SHALL 返回该月每一天的学习时长（分钟）和热力图色阶（level 0-4）。

#### Scenario: Valid month query returns daily data

- **WHEN** 已认证用户发起 `GET /api/analytics/calendar?year=2026&month=5`
- **THEN** 返回 200，days 数组包含当月每一天的 date、duration_minutes、level 字段

#### Scenario: Missing query parameters

- **WHEN** 请求未提供 year 或 month 参数
- **THEN** 返回 422，body 包含参数校验错误信息

#### Scenario: Invalid parameter value

- **WHEN** 请求提供 month=13 或 year=0 等非法值
- **THEN** 返回 422，body 包含参数范围校验错误信息

#### Scenario: Month with no learning records

- **WHEN** 用户查询有记录存在的年份但无记录的月份
- **THEN** 返回 200，days 数组中所有 duration_minutes 和 level 均为 0

### Requirement: Provide user achievement status

系统 SHALL 提供 `GET /api/analytics/achievements` 端点，返回所有预定义成就及当前用户的解锁状态。

每条成就 SHALL 包含 key、name、description、icon、unlocked（bool）、progress（当前进度）、target（目标值）、unlocked_at（解锁时间或 null）。

#### Scenario: User requests achievements list

- **WHEN** 已认证用户发起 `GET /api/analytics/achievements`
- **THEN** 返回 200，achievements 数组包含全部 6 项预定义成就，每项包含用户的解锁状态和进度

#### Scenario: New user with no progress

- **WHEN** 新用户（无任何学习记录）请求成就列表
- **THEN** 返回 200，所有成就的 unlocked 为 false，progress 为 0

#### Scenario: Unauthenticated request

- **WHEN** 请求未携带有效 token
- **THEN** 返回 401
