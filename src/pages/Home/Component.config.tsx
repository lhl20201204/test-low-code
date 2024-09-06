import { Col, DatePicker, Row, Select } from "antd";
import getUUID from "./util";
import WithCanDragable from "../Components/WithCanDragable";
import _ from "lodash";
import WithCanDropable from "../Components/WithCanDropable";
import React from "react";
import styles from './index.module.less';

export const forwardRefType = React.forwardRef(() => <></>)['$$typeof']

export const PageContainerConfig = WithCanDropable({
  type: 'rightContainer',
  label: '根页面',
  drop: true,
  needWrapDiv: true,
  Comp: Object.freeze((props:  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    return <div {...props}></div>
  }),
  defaultProps: Object.freeze({
    style: {
      height: 900,
    }
  }),
  id: getUUID('rightContainer'),
  children: [],
});

export const MemuContainerConfig = WithCanDropable({
  type: 'MemuContainer',
  label: '根页面',
  drop: true,
  needWrapDiv: true,
  Comp: Object.freeze((props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> ) => {
    return <div {...props}></div>
  }),
  id: getUUID('MemuContainer'),
  children: [],
});

export const globalBaseCompConfig = _.map([
  {
    type: 'Antd.Select',
    Comp: Select,
    needWrapDiv: true,
    label: '下拉选择框',
    draggable: true,
    defaultProps: {
      style: {
        width: 137,
      },
    }
  },
  {
    type: 'Antd.DatePicker',
    Comp: DatePicker,
    needWrapDiv: true,
    draggable: true,
    label: '日期选择框'
  },
  {
    type: 'Antd.Row',
    Comp: Row,
    label: '行布局',
    draggable: true,
    drop: true,
    defaultProps: {
      style: {
        height: 30,
        border: '1px solid #ebebeb',
      },
      justify: 'space-between'
    } as React.ComponentProps<typeof Row>,
    _onDropAddProps: {
      style: {
        height: 400,
      }
    } as React.ComponentProps<typeof Row>,
  },
  {
    type: 'Antd.Col',
    Comp: Col,
    label: '列布局',
    draggable: true,
    drop: true,
    defaultProps: {
      style: {
        height: 30,
        border: '1px solid #ebebeb',
      },
      span: 8,
    } as React.ComponentProps<typeof Col>,
    _onDropAddProps: {
      style: {
        height: '100%',
      }
    } as React.ComponentProps<typeof Col>,
  }
], x => {
  return Object.freeze({
    ...x,
    id: getUUID(x.type),
  })
})

export const LeftMenuConfig = globalBaseCompConfig.map(x => {
  return WithCanDragable({
    ...x,
    defaultProps: {
      ...x.defaultProps || {},
      className: _.compact([_.get(x.defaultProps, 'className'), x.needWrapDiv ?
    styles['disabled']: null]).join(' ')
    }
  })
});
