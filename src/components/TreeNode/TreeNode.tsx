import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { TreeNode as TreeNodeType, useStore } from '../../store/useStore';
import styles from './TreeNode.module.scss';

import invariant from 'tiny-invariant';
import { type Instruction, type ItemMode } from '@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { DependencyContext, TreeContext } from '../../DnD/context';
import { getItemMode } from '../../helpers/getItemMode';
import LeafData from '../LeafData/LeafData';

export const indentPerLevel = 32;

export interface TreeNodeProps {
  node: TreeNodeType;
  mode: ItemMode;
  level: number;
  index: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, mode, level, index }) => {
  const { fetchLeafData, leafData, leafError, toggleHighlight, highlightedNodes } = useStore();
  const isLeaf = !node.children || node.children.length === 0;
  const isOpenLeaf = isLeaf && leafData && leafData.id === node.id;
  const isLeafError = isLeaf && leafError && leafError.id === node.id;
  const [isExpanded, setIsExpanded] = useState(isOpenLeaf);
  const [localError, setLocalError] = useState<boolean>(!!isLeafError);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLeaf) {
      fetchLeafData(node.id);
      setIsExpanded(true);
    }
    toggleHighlight(node);
  };

  const isHighlighted = highlightedNodes.has(node.id);
  const containerRef = useRef<HTMLButtonElement>(null);

  const [instruction, setInstruction] = useState<Instruction | null>(null);

  const { dispatch, uniqueContextId, getPathToItem, registerTreeItem } = useContext(TreeContext);
  const { DropIndicator, attachInstruction, extractInstruction } = useContext(DependencyContext);

  useEffect(() => {
    invariant(containerRef.current);
    return registerTreeItem({
      itemId: node.id,
      element: containerRef.current,
      actionMenuTrigger: containerRef.current,
    });
  }, [node.id, registerTreeItem]);

  useEffect(() => {
    invariant(containerRef.current);

    return combine(
      draggable({
        element: containerRef.current,
        getInitialData: () => ({
          id: node.id,
          type: 'tree-node',
          uniqueContextId,
        }),
      }),
      dropTargetForElements({
        element: containerRef.current,
        getData: ({ input, element }) => {
          const data = { id: node.id };

          return attachInstruction(data, {
            input,
            element,
            indentPerLevel,
            currentLevel: level,
            mode,
            block: [],
          });
        },
        canDrop: ({ source }) => source.data.type === 'tree-node' && source.data.uniqueContextId === uniqueContextId,
        getIsSticky: () => true,
        onDrag: ({ self, source }) => {
          const instruction = extractInstruction(self.data);

          if (source.data.id !== node.id) {
            setInstruction(instruction);
            return;
          }
          if (instruction?.type === 'reparent') {
            setInstruction(instruction);
            return;
          }
          setInstruction(null);
        },
        onDragLeave: () => {
          setInstruction(null);
        },
        onDrop: () => {
          setInstruction(null);
        },
      }),
      monitorForElements({
        canMonitor: ({ source }) => source.data.uniqueContextId === uniqueContextId,
      })
    );
  }, [dispatch, node, mode, level, uniqueContextId, extractInstruction, attachInstruction, getPathToItem]);

  useEffect(() => {
    if (isLeafError) {
      setLocalError(true);
      const timeout = setTimeout(() => setLocalError(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isLeafError]);

  return (
    <>
      <div
        className={`${styles.container} ${isHighlighted ? styles.highlighted : ''}`}
        style={{ position: 'relative' }}
      >
        <button
          id={`tree-item-${node.id}`}
          ref={containerRef}
          type="button"
          style={{ paddingLeft: level * indentPerLevel }}
          data-index={index}
          data-level={level}
          data-testid={`tree-item-${node.id}`}
          className={`${styles.node} ${isLeaf ? styles.leaf : ''}`}
          onClick={handleClick}
        >
          <div className={styles.innerWrapper}>
            {isLeaf && <span className={styles.leafIcon}>🍃</span>}
            <span className={styles.label}>{node.label}</span>
          </div>
          {instruction ? <DropIndicator instruction={instruction} /> : null}
        </button>
      </div>
      {isLeafError && localError && (
        <div className={styles.error} style={{ marginLeft: level * indentPerLevel }}>
          {leafError.message}
        </div>
      )}
      {isOpenLeaf && isExpanded && <LeafData leafData={leafData} level={level} onClose={() => setIsExpanded(false)} />}
      {node.children && node.children.length > 0 && (
        <div>
          {node.children.map((child, index, array) => {
            const childType: ItemMode = getItemMode(node, index, array);
            return <TreeNode node={child} key={child.id} level={level + 1} mode={childType} index={index} />;
          })}
        </div>
      )}
    </>
  );
};

export default memo(TreeNode);
