---
title: Git
date: 2025-01-15
tags:
  - 字节青训营
---
## 项目初始化

在study文件下创建一个git，名字叫blog
```
mkdir study
cd study
git init blog
```

其他参数
```
--initial-branch  初始化的分支
--bare  创建一个裸仓库(纯 Git 目录，没有工作目录)
--template  可以通过模板来创建预先构建好的自定义 git 目录
```

## Git Config

不同级别的 Git 配置
- **--global   
- **--system
- **--local

每个级别的配置可能会重复，但是低级别的配置会覆盖高级别的配置

system > global > local

## 常见 Git 配置

### 用户名配置

```git
git config --global user.name "用户名"
git config --global user.email "用户邮箱地址"
```

### Instead of 配置

配置命令可以用于将 Git 命令中的 URL 映射到另一个 URL
比如下面把 `git@github.com` 映射成 `https://github.com/` ：
```
git config --global url.git@github.com:.insteadOf https://github.com/
```

### Git 命令别名配置

可以用来简化命令
比如下面把 `commit --amend --no-edit` 改成 `cin` ：
```
git config --global alias.cin "commit --amend --no-edit"
```

## Git Remote

列出当前仓库中已配置的远程仓库，并显示它们的 URL
```
git remote -v
```

添加一个新的远程仓库。指定一个远程仓库的名称和 URL，将其添加到当前仓库中 
`git remote add <remote_name> <remote_url>`
例如：
```
git remote add origin_ssh git@github.com:git/git.git
git remote add origin_http https://github.com/git/git.git
```

其他关于 Remote 命令可以通过 `git remote -h` 来查看

## Git Add

目执行 `git status` 查看 git 状态，可以看到一个新的管理的项目目前没有任何提交，然后我们在这个目录下创建一个 ==readme.md== 文件，使用 `touch readme.md` ，然后再通过 `git status` 查看状态

在git中，文件的状态只有三种(已修改、已暂存、已提交)
- **已修改**
    - 在工作目录修改Git文件
- **已暂存**
    - 对已修改的文件执行Git暂存操作(git add)，将文件存入暂存区
- **已提交**
    - 将已暂存的文件执行Git提交操作(git commit)，将文件存入版本库

我们对文件的各种操作新建、编辑(写代码)都是在`工作区`完成的，但是工作区的文件还是不被Git所管理的，Git会告诉你 read.me 是未被追踪的文件，需要执行`git add 文件名`把 readme.md 提交到`暂存区`以便纳入到Git版本管理中来

我们来执行git add 操作，然后再查看状态,可以看到index.php已经被暂存，如果我们想把现在的暂存撤销，可以使用`git rm --cached readme.md` 命令来撤销，如果想提交到版本库，就再执行git commit操作就可以了

在暂存区的文件使用`git commit readme.md -m"备注"`提交到版本库中

如果修改了文件并且上传，想要返回上次上次的快照，可以通过查看git status可以看到文件状态被改变了。可以把工作区修改的文件git add提交到暂存区，也可以使用 `git checkout —- readme.md` 把工作区的修改撤销，这样，文件就会回退到上一次提交时的状态。

### Objects 对象

Git对象一共有三种：数据对象、树对象以及提交对象，这些对象都被保存在了.git/objects目录下

- **Blob**
	- 存储文件的内容
- **Tree**
	- 存储文件的目录信息
- **Commit**
	- 存储提交信息，一个 Commit 可以对应唯一的版本的代码


通过 Commit 寻找到 Tree 信息，每个 Commit 都会存储对应的 Tree ID
使用 `tree .git` 查看 objects 中的所有信息，找到ID，然后使用 `git cat-file -p CommitID`，就能看到Tree ID 和 作者

通过 Tree 存储信息可以获取到对应的目录树信息，也是用 `git cat-file -p TreeID`

从 Tree 中获取 Blob 的 ID， `git cat-file -p BlobID` 获取到对应的文件内容
![](MarsCode学习笔记/1.Git/p1.png)

## Refs分支
### 新建、切换分支

```
切换分支：git checkout 分支名 
新建分支：git checkout -b 分支名
```

### Tag

标签一般表示一个稳定的版本，指向一个 Commit 一般不会变更
```
git tag -a 版本号 -m "备注"
```


### 修改历史版本

```
git commit --amend
```

## Git Clone & Pull & Fetch

- **Clone**
	- 拉取完整的仓库到本地目录，可以指定分支，深度
- **Fetch**
	- 将远端某些分支最新代码拉取到本地，不会执行 merger 操作，会修改 refs/remote 内的分支信息，如果需要和本地代码合并需要手动操作
- **Pull**
	- 拉取远端某些分支，并和本地代码进行合并，操作等同于 git fetch + git merger，也可以通过 git pull --rebase 完成 git fetch + git rebase 操作，**可能存在冲突，需要手动解决冲突**

**关于 Fetch ，Fetch 会把代码拉取到本地的远端分支，但是并不会合并到当前分支，所以当前分支历史没有变化**

## Git Push

将本地代码同步到远端的方式

一般使用 `git push origin 分支名`

**冲突问题**
- 如果本地的 commit 记录和远端的 commit 历史不一致，则会发生冲突，比如 git commit --amend or git rebase 都有可能导致这个问题
- 如果该分支就自己一个人使用，或者团队内确认可以修改历史则可以通过 `git push origin 分支名 -f` 来完成强制推送，一般不建议主干分支进行该操作，正常都应该解决冲突后再进行推送

