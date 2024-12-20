import { create } from 'zustand';
import { getLeafData, getTreeData } from '../api/getData';

export interface TreeNode {
  id: string;
  children?: TreeNode[];
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
  error?: string | null;
  leafError?: { id: string; message: string } | null;
  setTreeData: (data: TreeNode[]) => void;
  fetchAndSetTreeData: () => Promise<void>;
  fetchLeafData: (nodeId: string) => Promise<void>;
}

export const useStore = create<TreeState>((set) => ({
  treeData: [],
  leafData: null,
  loading: false,
  error: null,
  leafError: null,
  setTreeData: (data) => set({ treeData: data }),
  fetchAndSetTreeData: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getTreeData();
      set({ treeData: data });
    } catch (err) {
      set({ error: (err as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  fetchLeafData: async (nodeId: string) => {
    set({ loading: true, error: null });
    try {
      console.log(nodeId);
      const data = await getLeafData(nodeId);
      set({ leafData: { ...data, id: nodeId } });
    } catch (err) {
      set({ leafError: { id: nodeId, message: (err as Error).message } });
    } finally {
      set({ loading: false });
    }
  },
}));
