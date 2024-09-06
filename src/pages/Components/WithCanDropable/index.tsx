import { useContext, useRef } from "react";
import styles from './index.module.less';
import getUUID, { getNearCanDropDom, mergeProps } from "@/pages/Home/util";
import _ from "lodash";
import { MemuContainerConfig, forwardRefType, globalBaseCompConfig } from "@/pages/Home/Component.config";
import { IComp, IConfigItem } from "@/pages/Home/Config.type";
import { MyContext } from "@/pages/Home/MyContext";
import WithCanDragable from "../WithCanDragable";
import React from "react";

const idMap = new Map();
function save(ret: any) {
  idMap.set(ret.id, ret);
  return ret;
}

const clearStyle = (e, flag) => {
  const dom = getNearCanDropDom(e.target as HTMLElement);
  if (dom) {
    dom.classList.remove(styles['drag-enter'])
    if (flag &&dom?.dataset.id === MemuContainerConfig.id) {
      dom.classList.remove(styles['delete-item'])
    }
  }
}

export default function WithCanDropable<
  T extends IComp = IComp,
  G extends IConfigItem<T> = IConfigItem<T>
>(Item: G): G & { RenderComp: T } {
  if (idMap.has(Item.id)) {
    return idMap.get(Item.id);
  }
  if (!Item.drop) {
    return save({
      ...Item,
      RenderComp: _.get(Item, 'RenderComp', Item.Comp) as T,
    });
  }
  const TempComp = _.get(Item, 'RenderComp', Item.Comp);
  const TargetComp = Item.needWrapDiv || TempComp['$$typeof'] === forwardRefType ? TempComp : React.forwardRef(TempComp as any) as unknown as T;
  function CanDropComp(props: React.ComponentProps<T>, ref: any) {
    const store = useContext(MyContext);
    const onDragOver = useRef(((e) => {
      e.preventDefault()
    }) as React.DragEventHandler<HTMLDivElement>)

    const onDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      const dom = getNearCanDropDom(e.target as HTMLElement);
      if (dom) {
        dom.classList.add(styles['drag-enter'])
        if (dom?.dataset.id === MemuContainerConfig.id) {
          dom.classList.add(styles['delete-item'])
        }
      }
    }

    const onDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      clearStyle(e, false)
    }

    const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation()
      const dom = getNearCanDropDom(e.target as HTMLElement);
      clearStyle({ target: dom }, false)
      const id = e.dataTransfer.getData('text');
      const pId = dom?.dataset.id;
      const config = _.find(globalBaseCompConfig, ['id', id]) as IConfigItem<IComp>
      if (pId === MemuContainerConfig.id && !config) {
        store.deleteById(id)
        return;
      }
      if (pId && store.totalIdList.includes(id)) {
        store.move(pId, id)
        return;
      }

      if (pId && config) {
        store.pushConfigByParentId(pId as string, _.reduce(
          [WithCanDragable, WithCanDropable],
          (p, v) => v(p)
          , {
            ...config,
            id: getUUID(config.id),
            props: mergeProps(config.defaultProps, config._onDropAddProps)
          }))
      }
    }

    const obj = {
      ref: (x) => {
        if (x && x.dataset.id !== Item.id) {
          x.setAttribute('data-id', Item.id);
        }
        if (ref) {
          ref.current = x;
        }
      },
      'data-drop': true,
      onDragEnter,
      onDragLeave,
      onDragOver: onDragOver.current,
      onDrop,
    }

    return Item.needWrapDiv ? <div {...obj}>
      <TargetComp {...props} />
    </div> : <TargetComp  {...props} {...obj as any} />
  }
  return save({
    ...Item,
    RenderComp: React.forwardRef(CanDropComp),
  });
}