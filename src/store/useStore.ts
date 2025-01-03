import { create } from 'zustand';
import { getLeafData, getTreeData } from '../api/getData';
import { addIdsToTree } from '../helpers/mapData';
import type { Instruction as InstructionType } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/tree-item';

export type TreeAction = {
  type: 'instruction';
  itemId: string;
  targetId: string;
  instruction: InstructionType;
};
export interface TreeNode {
  id: string;
  children: TreeNode[];
  label: string;
}
export interface TreeNodeData {
  id?: string;
  children: TreeNodeData[];
  label: string;
}

export interface TreeLeafNode {
  id: string;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
  description: string;
}

interface TreeState {
  treeData: TreeNode[];
  leafData: TreeLeafNode | null;
  loading: boolean;
  error: string | null;
  leafError: { message: string; id: string } | null;
  leafCache: Record<string, TreeLeafNode>;
  lastAction: { type: string; itemId?: string; targetId?: string } | null;
  fetchAndSetTreeData: () => Promise<void>;
  fetchLeafData: (nodeId: string) => Promise<void>;
  uniqueContextId: symbol;
  dispatch: (action: TreeAction) => void;
  getPathToItem: (itemId: string) => string[];
  getMoveTargets: ({ itemId }: { itemId: string }) => TreeNode[];
  getChildrenOfItem: (itemId: string) => TreeNode[];
  highlightedNodes: Set<string>;
  toggleHighlight: (node: TreeNode) => void;
}

export const useStore = create<TreeState>((set, get) => ({
  treeData: [],
  leafData: null,
  loading: false,
  error: null,
  leafError: null,
  lastAction: null,
  leafCache: {},
  highlightedNodes: new Set(),
  fetchAndSetTreeData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTreeData();
      const processedData = addIdsToTree(data);
      set({ treeData: processedData });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  fetchLeafData: async (nodeId: string) => {
    const { leafCache } = get();
    if (leafCache[nodeId]) {
      set({ leafData: leafCache[nodeId] });
      return;
    }

    set({ loading: true, leafError: null });
    try {
      const data = await getLeafData(nodeId);
      const leafNodeData = { ...data, id: nodeId };

      console.log('Leaf Node Data:', data, leafNodeData);
      set((state) => ({
        leafCache: { ...state.leafCache, [nodeId]: leafNodeData },
        leafData: leafNodeData,
      }));
    } catch (err) {
      set({
        leafError: { message: `Error fetching leaf data: ${(err as Error).message}`, id: nodeId },
      });
    } finally {
      set({ loading: false });
    }
  },
  uniqueContextId: Symbol('uniqueId'),

  dispatch: (action: TreeAction) => {
    const { treeData } = get();

    if (action.type === 'instruction') {
      const { itemId, targetId, instruction } = action;
      const tree = createTreeManipulationHelpers();

      const item = tree.find(treeData, itemId);
      if (!item) return;

      const updatedTree = (() => {
        switch (instruction.type) {
          case 'reparent': {
            const path = tree.getPathToItem(treeData, targetId);
            if (!path) return treeData;
            const desiredId = path[instruction.desiredLevel!];
            return tree.insertAfter(tree.remove(treeData, itemId), desiredId, item);
          }
          case 'reorder-above':
            return tree.insertBefore(tree.remove(treeData, itemId), targetId, item);
          case 'reorder-below':
            return tree.insertAfter(tree.remove(treeData, itemId), targetId, item);
          case 'make-child':
            return tree.insertChild(tree.remove(treeData, itemId), targetId, item);
          default:
            return treeData;
        }
      })();

      set({ treeData: updatedTree });
    }
  },

  getPathToItem: (itemId: string) => {
    const { treeData } = get();
    const tree = createTreeManipulationHelpers();
    return tree.getPathToItem(treeData, itemId) || [];
  },

  getMoveTargets: ({ itemId }: { itemId: string }) => {
    const { treeData } = get();
    const tree = createTreeManipulationHelpers();
    return tree.getMoveTargets(treeData, itemId);
  },

  getChildrenOfItem: (itemId: string) => {
    const { treeData } = get();
    const tree = createTreeManipulationHelpers();
    return tree.getChildrenOfItem(treeData, itemId) || [];
  },
  toggleHighlight: (node: TreeNode) => {
    const { highlightedNodes } = get();
    const updated = new Set(highlightedNodes);

    const addHighlight = (node: TreeNode) => {
      updated.add(node.id);
      node.children?.forEach(addHighlight);
    };

    const removeHighlight = (node: TreeNode) => {
      updated.delete(node.id);
      node.children?.forEach(removeHighlight);
    };

    if (updated.has(node.id)) {
      removeHighlight(node);
    } else {
      addHighlight(node);
    }

    set({ highlightedNodes: updated });
  },
}));

const createTreeManipulationHelpers = () => ({
  remove(data: TreeNode[], id: string): TreeNode[] {
    return data
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        children: this.remove(node.children || [], id),
      }));
  },
  insertBefore(data: TreeNode[], targetId: string, newItem: TreeNode): TreeNode[] {
    return data.flatMap((node) =>
      node.id === targetId
        ? [newItem, node]
        : { ...node, children: this.insertBefore(node.children || [], targetId, newItem) }
    );
  },
  insertAfter(data: TreeNode[], targetId: string, newItem: TreeNode): TreeNode[] {
    return data.flatMap((node) =>
      node.id === targetId
        ? [node, newItem]
        : { ...node, children: this.insertAfter(node.children || [], targetId, newItem) }
    );
  },
  insertChild(data: TreeNode[], targetId: string, newItem: TreeNode): TreeNode[] {
    return data.map((node) =>
      node.id === targetId
        ? { ...node, children: [newItem, ...(node.children || [])] }
        : { ...node, children: this.insertChild(node.children || [], targetId, newItem) }
    );
  },
  find(data: TreeNode[], id: string): TreeNode | undefined {
    for (const node of data) {
      if (node.id === id) return node;
      const found = this.find(node.children || [], id);
      if (found) return found;
    }
  },
  getPathToItem(data: TreeNode[], id: string, path: string[] = []): string[] | undefined {
    for (const node of data) {
      if (node.id === id) return path;
      const nestedPath = this.getPathToItem(node.children || [], id, [...path, node.id]);
      if (nestedPath) return nestedPath;
    }
  },
  getMoveTargets(data: TreeNode[], itemId: string): TreeNode[] {
    return data
      .filter((node) => node.id !== itemId)
      .flatMap((node) => {
        const childrenTargets = this.getMoveTargets(node.children || [], itemId);
        return [node, ...childrenTargets];
      });
  },
  getChildrenOfItem(data: TreeNode[], itemId: string): TreeNode[] {
    const node = this.find(data, itemId);
    return node?.children || [];
  },
});
