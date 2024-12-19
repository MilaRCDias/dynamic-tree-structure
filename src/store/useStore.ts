import { create } from 'zustand';
import { getTreeData } from '../api/getData';

interface TreeNode {
  id: string;
  children?: TreeNode[];
  label: string;
}

interface TreeState {
  treeData: TreeNode[];
  loading: boolean;
  error?: string | null;
  setTreeData: (data: TreeNode[]) => void;
  fetchAndSetTreeData: () => Promise<void>;
}

export const useStore = create<TreeState>((set) => ({
  treeData: [],
  loading: false,
  error: null,
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
}));
