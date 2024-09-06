import _ from 'lodash';
import styles from './index.module.less'
import { IComp, IConfigItem } from '@/pages/Home/Config.type';
import React from 'react';
import { forwardRefType } from '@/pages/Home/Component.config';

const idMap = new Map();
function save(ret: any) {
  idMap.set(ret.id, ret);
  return ret;
}
export default function WithCanDragable<
T extends IComp = IComp,
G extends IConfigItem<T> = IConfigItem<T>
>(Item: G): G & { RenderComp: T } {
  if (idMap.has(Item.id)) {
    return idMap.get(Item.id);
  }
  
  if (!Item.draggable) {
    return save({
      ...Item,
      RenderComp: _.get(Item, 'RenderComp', Item.Comp) as T,
    });
  }
  const TempComp = _.get(Item, 'RenderComp', Item.Comp) as T;
  const TargetComp = Item.needWrapDiv || TempComp['$$typeof'] === forwardRefType ? TempComp : React.forwardRef(TempComp as any) as unknown as T;
  function CanDragableComp(props: React.ComponentProps<T>, ref: any) {
    const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      setTimeout(() => {
        (e.target as HTMLDivElement).classList.add(styles['draging'])
      })
      e.dataTransfer.effectAllowed = 'all';
      e.dataTransfer.setData("text/plain", Item.id)
    }

    const onDragEnd: React.DragEventHandler<HTMLDivElement> = (e: any) => {
      (e.target as HTMLDivElement).classList.remove(styles['draging'])
    }

    const obj = {
      draggable: true,
      onDragStart,
      onDragEnd,
      className: styles['drag-item'],
    }


    return Item.needWrapDiv ? <div
      {...obj}>
      <TargetComp {..._.get(Item,'defaultProps', {})} {...props}/>
    </div> : <TargetComp {..._.get(Item,'defaultProps', {})} {...props} {...obj as any} ref={ref}/>
  }
  return save({
    ...Item,
    RenderComp: React.forwardRef(CanDragableComp),
  });
}