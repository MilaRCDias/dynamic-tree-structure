import { v4 as uuidv4 } from 'uuid';
import { TreeNode, TreeNodeData } from '../store/useStore';

export const addIdsToTree = (nodes: TreeNodeData[]): TreeNode[] => {
  return nodes.map((node) => {
    const newId = node.id && node.id.trim() !== '' ? node.id : uuidv4();
    const newChildren = node.children ? addIdsToTree(node.children) : [];

    return {
      ...node,
      id: newId,
      children: newChildren,
    };
  });
};
