import { createContext } from 'react';

import { attachInstruction, extractInstruction } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/tree-item';

import { TreeAction, useStore } from '../store/useStore';

import { TreeNode } from '../store/useStore';
export type TreeContextValue = {
  dispatch: (action: TreeAction) => void;
  uniqueContextId: symbol;
  getPathToItem: (itemId: string) => string[];
  getMoveTargets: ({ itemId }: { itemId: string }) => TreeNode[];
  getChildrenOfItem: (itemId: string) => TreeNode[];
  registerTreeItem: (args: { itemId: string; element: HTMLElement; actionMenuTrigger: HTMLElement }) => void;
};

export const TreeContext = createContext<TreeContextValue>({
  dispatch: useStore.getState().dispatch,
  uniqueContextId: useStore.getState().uniqueContextId,
  getPathToItem: useStore.getState().getPathToItem,
  getMoveTargets: useStore.getState().getMoveTargets,
  getChildrenOfItem: useStore.getState().getChildrenOfItem,
  registerTreeItem: () => {},
});

export type DependencyContext = {
  DropIndicator: typeof DropIndicator;
  attachInstruction: typeof attachInstruction;
  extractInstruction: typeof extractInstruction;
};

export const DependencyContext = createContext<DependencyContext>({
  DropIndicator: DropIndicator,
  attachInstruction: attachInstruction,
  extractInstruction: extractInstruction,
});
