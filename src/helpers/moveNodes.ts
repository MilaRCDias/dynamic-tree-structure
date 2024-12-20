import { TreeNode } from '../store/useStore';

export const removeNodes = (
  nodes: TreeNode[],
  nodeIds: string[]
): { updatedNodes: TreeNode[]; removedNodes: TreeNode[] } => {
  let removedNodes: TreeNode[] = [];

  const traverse = (currentNodes: TreeNode[]): TreeNode[] => {
    return currentNodes.reduce<TreeNode[]>((acc, node) => {
      if (nodeIds.includes(node.id)) {
        removedNodes.push(node);
        return acc;
      }
      if (node.children) {
        const result = removeNodes(node.children, nodeIds);
        removedNodes = removedNodes.concat(result.removedNodes);
        if (result.updatedNodes.length > 0) {
          acc.push({ ...node, children: result.updatedNodes });
        } else {
          acc.push({ ...node, children: undefined });
        }
      } else {
        acc.push(node);
      }
      return acc;
    }, []);
  };

  const updatedNodes = traverse(nodes);
  return { updatedNodes, removedNodes };
};

export const insertNodes = (
  nodes: TreeNode[],
  parentId: string | null,
  nodesToInsert: TreeNode[],
  index: number
): TreeNode[] => {
  if (parentId === null) {
    const updatedNodes = [...nodes];
    updatedNodes.splice(index, 0, ...nodesToInsert);
    return updatedNodes;
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      const updatedChildren = node.children ? [...node.children] : [];
      updatedChildren.splice(index, 0, ...nodesToInsert);
      return { ...node, children: updatedChildren };
    }
    if (node.children) {
      return { ...node, children: insertNodes(node.children, parentId, nodesToInsert, index) };
    }
    return node;
  });
};
