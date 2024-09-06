import Two from "@/pages/About/Two";
import One from '@/pages/About/One';
import { HOME } from "@/pages/Home";
import _ from "lodash";
import { BrowserRouter, HashRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Col, Row } from "antd";
import { Suspense } from "react";
import React from "react";
import { LoadingOutlined } from '@ant-design/icons';

const routerConfig = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    Comp: HOME,
  },
  {
    path: '/about',
    Comp: () => new Promise(r => {
      setTimeout(() => {
        r(import('@/pages/About'))
      }, 4000)
    }),
    dynamic: true,
    fallback: <LoadingOutlined />,
    children: [
      {
        path: '/',
        redirect: '/one',
      },
      {
        path: '/one',
        Comp: One
      },
      {
        path: '/two',
        Comp: Two
      }
    ]
  }
]

const getRoute = (arr: typeof routerConfig, rootPath = '') => {
  return _.map(arr, item => {
    const path = rootPath + item.path;
    const Comp = () => {
      if (!item.Comp) {
        return null;
      }
      if (item.dynamic) {
        const DynamicComp = React.lazy(() => {
          const ret = item.Comp() as Promise<{ default: unknown }>;
          ret.then((r) => {
            item.Comp = r.default;
            Reflect.deleteProperty(item, 'dynamic')
          })
          return ret;
        })
        return <Suspense fallback={item.fallback ?? 'loading'} >
          <DynamicComp > <Outlet /></DynamicComp>
        </Suspense>
      }
      return <item.Comp><Outlet /></item.Comp>
    }
    return <Route
      path={path}
      key={path}
      element={
        !item.redirect && item.Comp
          ? <Comp />
          : <Navigate to={rootPath + item.redirect} />
      }>
      {
        getRoute(item.children || [], path)
      }
    </Route>
  })
}

export default function MyRoutes() {
  return <BrowserRouter>
  <Row>
    <Col span={6}>
      侧边栏
    </Col>
    <Col span={18}>
    <Routes>
      {
        getRoute(routerConfig)
      }
    </Routes>
    </Col>
  </Row>
  </BrowserRouter>
}