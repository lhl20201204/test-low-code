import { Col, Row } from 'antd';
import styles from './index.module.less'
import { LeftMenuConfig, MemuContainerConfig } from './Component.config';
import { useMemo } from 'react';
import Store from './Store';
import { MyContext } from './MyContext';
import { IConfigItem } from './Config.type';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

function renderDynamicComp(arr: IConfigItem[]) {
  return _.map(arr, item => {
    const Comp = item.RenderComp || item.Comp;
    return <Comp key={item.id} {...toJS(item.defaultProps || {})} {...toJS(item.props || {})}>{renderDynamicComp(item.children || [])}</Comp>
  })
}

export const HOME = observer(function () {
  const store = useMemo(() => new Store(), []);

  return (
    <MyContext.Provider value={store}>
      <Row className={[styles['home-wrap']].join(' ')} gutter={16}>
        <Col span={6}>
          <MemuContainerConfig.RenderComp style={{minHeight: 900, padding: 16 }}>
            {
              LeftMenuConfig.map((C) => {
                return <div key={C.id}>
                  <span>{C.label}:</span>
                  <C.RenderComp />
                </div>
              })
            }
          </MemuContainerConfig.RenderComp>
        </Col>
        <Col span={18}>
          {renderDynamicComp(store.templateConfig)}
        </Col>
      </Row>
    </MyContext.Provider>
  )
})