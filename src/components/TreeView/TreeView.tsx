import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TreeView.module.scss';
import { useStore } from '../../store/useStore';
import TreeNode from '../TreeNode';

import invariant from 'tiny-invariant';

import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { DependencyContext, TreeContext } from '../../DnD/context';
import { createTreeItemRegistry } from '../../helpers/registerDnd';
import { getItemMode } from '../../helpers/getItemMode';

const TreeView: React.FC = () => {
  const { treeData, fetchAndSetTreeData, loading, error, dispatch, getChildrenOfItem, uniqueContextId } = useStore();
  const { extractInstruction } = useContext(DependencyContext);

  useEffect(() => {
    fetchAndSetTreeData();
  }, [fetchAndSetTreeData]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || treeData.length === 0) return;
    invariant(ref.current);
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.uniqueContextId === uniqueContextId,
        onDrop: ({ location, source }) => {
          if (!location.current.dropTargets.length) return;

          if (source.data.type === 'tree-node') {
            const itemId = source.data.id as string;
            const targetId = location.current.dropTargets[0].data.id as string;
            const instruction = extractInstruction(location.current.dropTargets[0].data);

            if (instruction) {
              dispatch({
                type: 'instruction',
                itemId,
                targetId,
                instruction,
              });
            }
          }
        },
      })
    );
  }, [treeData, uniqueContextId, extractInstruction, dispatch]);

  const [{ registerTreeItem }] = useState(createTreeItemRegistry);

  const contextValue = useMemo(
    () => ({
      dispatch,
      uniqueContextId,
      getPathToItem: useStore.getState().getPathToItem,
      getMoveTargets: useStore.getState().getMoveTargets,
      getChildrenOfItem,
      registerTreeItem,
    }),
    [dispatch, uniqueContextId, getChildrenOfItem]
  );

  if (loading && treeData.length === 0) return <div>Loading tree...</div>;
  if (error) return <div>{error}</div>;
  if (!treeData || treeData.length === 0) return <div>No Data</div>;

  return (
    <TreeContext.Provider value={contextValue}>
      <div className={styles.treeContainer}>
        <div className={styles.tree} ref={ref}>
          {treeData.map((node, index, array) => {
            const type = getItemMode(node, index, array);

            return <TreeNode key={node.id} node={node} level={0} mode={type} index={index} />;
          })}
        </div>
      </div>
    </TreeContext.Provider>
  );
};

export default TreeView;
