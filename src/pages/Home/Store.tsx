import { action, computed, observable } from "mobx";
import { IComp, IConfigItem } from "./Config.type";
import _ from "lodash";
import { PageContainerConfig } from "./Component.config";


function travese<T extends IConfigItem<IComp>, G extends T | [T, T[]]>(list: T[], pId: string, callback: (c: T, p: T[]) => G): G | null {
  for (const x of list) {
    if (x.id === pId) {
      return callback(x, list);
    }
    const c = travese((x.children || []) as T[], pId, callback)
    if (c) {
      return c;
    }
  }
  return null;
}

function getId(arr: IConfigItem[]): string[] {
  return _.flatten(_.map(arr, c => [c.id, ...getId(c.children || [])]))
}

class Store {
  @observable templateConfig: IConfigItem[] = [PageContainerConfig];

  @action.bound pushConfigByParentId(pId: string, config: IConfigItem) {
    const pNode = travese(this.templateConfig, pId, (x) => x);
    if (!pNode) {
      console.warn('加入出错');
      return;
    }
    if (!_.isArray(pNode.children)) {
      pNode.children = []
    }
    pNode.children.push(config)
  }

  @computed get totalIdList() {
    return getId(this.templateConfig);
  }

  @action.bound deleteById(cId: string): IConfigItem | null{
    const [x, p] = travese(this.templateConfig, cId, (x, p) => [x, p]) || [];
    if (!x || !p) {
      console.warn('删除出错')
      return null;
    }
    p.splice(_.indexOf(p, x), 1);
    return x;
  }

  @action.bound move(pId: string, cId: string) {
    const target = this.deleteById(cId);
    if (!target) {
      console.warn('移动出错')
      return;
    }
    const pNode = travese(this.templateConfig, pId, (x) => x);
    if (pNode) {
      if (!_.isArray(pNode.children)) {
        pNode.children = []
      }
      pNode.children.push(target)
    }
  }
}

export default Store;