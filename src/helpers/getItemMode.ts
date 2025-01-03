import { TreeNode } from '../store/useStore';

export type ItemMode = 'expanded' | 'last-in-group' | 'standard';

export function getItemMode(node: TreeNode, index: number, array: TreeNode[]): ItemMode {
  if (node.children.length) {
    return 'expanded';
  }

  if (index === array.length - 1) {
    return 'last-in-group';
  }

  return 'standard';
}
