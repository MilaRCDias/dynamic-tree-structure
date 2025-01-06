import { TreeNode } from '../store/useStore';

export type ItemMode = 'expanded' | 'last-in-group' | 'standard';

export enum Mode {
  Expanded = 'expanded',
  LastInGroup = 'last-in-group',
  Standart = 'standard',
}

export function getItemMode(node: TreeNode, index: number, array: TreeNode[]): ItemMode {
  if (node.children.length) {
    return Mode.Expanded;
  }

  if (index === array.length - 1) {
    return Mode.LastInGroup;
  }

  return Mode.Standart;
}
