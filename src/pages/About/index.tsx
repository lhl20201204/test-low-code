import React from "react";

export default function About(props: {
  children?: React.ReactNode;
}) {
  return <div>
    关于
    {props.children}
  </div>
}