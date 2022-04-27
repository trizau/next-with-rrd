在next.js中使用react-router-dom时根据文件结构自动生成路由文件.

# why use

> https://colinhacks.com/essays/building-a-spa-with-nextjs

为什么使用 `react-router-dom` 及 如何在next.js中使用react-router-dom参考链接内容

# install

1. `npm i -D next-with-rrd` or `yarn add -D next-with-rrd`
2. watching
    1. `npx next-with-rrd` or `yarn next-with-rrd`

# setup

## config

在项目目录下新建`next-with-rrd.json`文件, 键为要监听的**文件夹**，值为存放生成的路由组件的**文件**

配置文件示例:

```json
{
  "/test/src": "/example/GenRoute.tsx"
}
```

例如此文件结构 (可参考remix文件路由)

```
/test/src
         \index.tsx
         |user
            \index.tsx
            |create.tsx
            |show
               \:id.tsx
         |post.tsx
         |post
            \show.tsx
            |:id.tsx
         |product
            \:id.tsx
         |404.tsx
```

将会自动生成如下路由

```tsx
import React from "react";
import {useRoutes} from "react-router-dom";
import TestSrc404 from "/test/src/404";
import TestSrcIndex from "/test/src/index";
import TestSrcPost from "/test/src/post";
import TestSrcPostId from "/test/src/post/:id";
import TestSrcPostShow from "/test/src/post/show";
import TestSrcProductId from "/test/src/product/:id";
import TestSrcUserIndex from "/test/src/user";
import TestSrcUserCreate from "/test/src/user/create";
import TestSrcUserShowId from "/test/src/user/show/:id";

// eslint-disable-next-line
export default () =>
    useRoutes([
        {path: "*", element: <TestSrc404/>},
        {path: "", element: <TestSrcIndex/>},
        {
            path: "post",
            element: <TestSrcPost/>,
            children: [
                {path: ":id", element: <TestSrcPostId/>},
                {path: "show", element: <TestSrcPostShow/>},
            ],
        },
        {
            path: "product",
            children: [{path: ":id", element: <TestSrcProductId/>}],
        },
        {
            path: "user",
            element: <TestSrcUserIndex/>,
            children: [
                {path: "create", element: <TestSrcUserCreate/>},
                {
                    path: "show",
                    children: [{path: ":id", element: <TestSrcUserShowId/>}],
                },
            ],
        },
    ]);

```

## using

生成的路由文件可以直接在代码中这样使用:

```tsx
import {HashRouter, Routes, Route} from "react-router-dom";
import GenRoutes from "/example/GenRoute";

const App = () =>
    <HashRouter>
        <GenRoutes/>
    </HashRouter>
```
