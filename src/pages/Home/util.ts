import _ from "lodash";

const joinSign = '#';

export default function getUUID(compType: string) {
  return (
    compType +
    joinSign +
    (Number(new Date()) +
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2))
  );
}

export function getNearCanDropDom(dom: HTMLElement) {
  let t: HTMLElement | null = dom;
  while(t && !t.dataset.drop) {
    t = t.parentElement
  }
  return t;
}

export function mergeProps<T extends Record<string, any>>(old: T = {} as T, newProps: T ={} as T, c: string[] = []): T {
  const oldProps = _.size(c) ? old : _.cloneDeep(old);
  let target
  if (!_.size(c)) {
    target = oldProps;
  } else {
    const path = _.join(c, '.');
    if (!_.has(oldProps, path)) {
      _.set(oldProps, path, {});
    }
    target = _.get(oldProps, path);
  }
  for(const attr in newProps) {
    const v = newProps[attr]
    if (_.isObject(v) && !_.isArray(v)) {
      mergeProps(oldProps, v, [...c, attr])
    } else {
      target[attr] = v;
    }
  }
  return oldProps;
}