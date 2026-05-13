## ADDED Requirements

### Requirement: Display daily goal checklist

系统 SHALL 展示用户当日的学习目标清单，每项包含标题和完成状态。

用户 SHALL 能够勾选或取消勾选任意目标项，系统 SHALL 实时更新完成进度。

#### Scenario: Goals render with completion states

- **WHEN** 用户访问每日目标页面（/goals）
- **THEN** 系统展示当日目标清单，每项左侧显示 checkbox 表明完成状态

#### Scenario: User checks off a goal

- **WHEN** 用户点击未完成目标前的 checkbox
- **THEN** 该目标标记为已完成（checkbox 勾选，文字添加删除线），顶部进度条更新

#### Scenario: User unchecks a completed goal

- **WHEN** 用户点击已完成目标前的 checkbox
- **THEN** 该目标恢复为未完成状态，顶部进度条更新

#### Scenario: Progress display updates

- **WHEN** 用户勾选或取消目标后
- **THEN** 进度文字从 "已完成 2/5" 更新为对应比例（如 "已完成 3/5"），进度条宽度相应调整

#### Scenario: Error - empty goal list

- **WHEN** mock 数据中目标列表为空数组
- **THEN** 系统显示 "今日暂无目标，去添加一个吧" 的空状态提示
