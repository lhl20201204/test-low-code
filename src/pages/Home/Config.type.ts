
export type IComp =  React.JSXElementConstructor<any> | keyof JSX.IntrinsicElements;

export type IConfigItem<T extends IComp = IComp> = {
  Comp: T;
  type: string;
  id: string;
  drop?: boolean;
  RenderComp?: T;
  defaultProps?: React.ComponentProps<T>;
  _onDropAddProps?: React.ComponentProps<T>;
  props?: React.ComponentProps<T>;
  draggable?: boolean;
  children?: IConfigItem<T>[];
  needWrapDiv?: boolean;
}