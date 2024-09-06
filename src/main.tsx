import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.less';
import MyRoutes from './router/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MyRoutes />
  </React.StrictMode>,
)
