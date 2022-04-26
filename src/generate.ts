import fs from "fs";
import prettier from "prettier";

async function scan(startDir: string) {
    const route: any = {};
    for (const item of fs.readdirSync(startDir)) {

        const _item = startDir + '/' + item; // 带前缀的路径名

        // 忽略除jsx, jsx外的文件
        if (fs.statSync(_item).isFile())
            if (!item.endsWith('.jsx') && !item.endsWith('.tsx')) continue;

        const path = item.replace(/\..*$/, ''); // 路由地址
        if (!route[path]) {
            // 作为引入的文件路径
            route[path] = {filepath: _item.replace(/\..*$/, '')};
        }

        if (fs.statSync(_item).isFile()) {
            // 组件
            route[path].element = _item
                .replace(/\..*$/, '')
                .replace(/\W+\w/g, (match) => match.slice(-1).toUpperCase())
                .replace(/^\w/, (match) => match.toUpperCase());
        } else {
            // 子组件
            route[path].children = await scan(_item);
        }
    }
    return route;
}

async function generate(startDir: string) {
    let tpl = `import React from "react";import {useRoutes} from "react-router-dom";`;


    async function genRoute(obj: { [keys: string]: any }) {
        let r = '';
        for (const [path, route] of Object.entries(obj)) {
            if (route.element) {
                tpl += `import ${route.element} from "/${route.filepath}";`;
            }

            const _path = path == 'index' ? '' : path;

            if (obj[path].children && Object.keys(obj[path].children).length) {
                // console.log(obj[path].children)
                const children = await genRoute(obj[path].children)
                if (route.element) {
                    r += `{path: '${_path}', element: <${route.element}/>, children: [${children}]},`;
                } else {
                    r += `{path: '${_path}', children: [${children}]},`;
                }
            } else {
                if (route.element) {
                    r += `{path: '${_path}', element: <${route.element}/>},`;
                }
            }
        }
        return r;
    }

    const x = await scan(startDir);
    // console.log(x)
    const routes = await genRoute(x);

    tpl += `\n\n// eslint-disable-next-line\n export default () => useRoutes([${routes}]);\n`;
    // tpl += 'export default Routes;';
    return prettier.format(tpl, {parser: 'babel'});
}

export default generate;
