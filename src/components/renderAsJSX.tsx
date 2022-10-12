import React from "react";

export function renderAsJSX(nodes: any[]): any[] {
  return nodes.map((node: any) => {
    let children = null;

    if (Array.isArray(node.children)) {
      // if (node.children && node.children.length > 0) {
      children = renderAsJSX(node.children);
      // }
    } else {
      children = node.children;
    }

    return <>{React.createElement(node.tag, node.attributes, children)}</>;
  });
}
