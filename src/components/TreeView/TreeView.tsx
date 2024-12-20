import React, { useState } from 'react';
import styles from './TreeView.module.scss';
import { TreeNode } from '../../store/useStore';
import { Tree, NodeRendererProps } from 'react-arborist';
import { insertNodes, removeNodes } from '../../helpers/moveNodes';

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  return (
    <div style={style} ref={dragHandle}>
      {node.isLeaf ? '🍁' : '>'}
      {node.data.name}
    </div>
  );
}

//mock
const initialData = [
  {
    id: 'imgly',
    label: 'img.ly',
    children: [
      {
        id: 'imgly.WorkspaceA',
        label: 'Workspace A',
        children: [
          { id: 'imgly.A.1', label: 'Entry 1' },
          { id: 'imgly.A.2', label: 'Entry 2' },
          { id: 'imgly.A.3', label: 'Entry 3' },
        ],
      },
      {
        id: 'imgly.WorkspaceB',
        label: 'Workspace B',
        children: [
          { id: 'imgly.B.1', label: 'Entry 1' },
          { id: 'imgly.B.2', label: 'Entry 2' },
          {
            id: 'imgly.B.3',
            label: 'Entry 3',
            children: [{ id: 'imgly.B.3.1', label: 'Sub-Entry 1' }],
          },
        ],
      },
    ],
  },
  {
    id: '9elements',
    label: '9elements',
    children: [
      {
        id: '9elements.WorkspaceA',
        label: 'Workspace A',
        children: [
          { id: '9e.A.1', label: 'Entry 1' },
          { id: '9e.A.2', label: 'Entry 2' },
        ],
      },
    ],
  },
];

// todo: transform data object keys to match the TreeNode interface in arborist
// todo: highlight the node that is being click and subtree
const TreeView: React.FC = () => {
  /*   const { treeData, fetchAndSetTreeData, loading, error } = useStore();

  useEffect(() => {
    fetchAndSetTreeData();
  }, [fetchAndSetTreeData]); */
  const [treeData, setTreeData] = useState<TreeNode[]>(initialData);

  const handleMove = ({ dragIds, parentId, index }: { dragIds: string[]; parentId: string | null; index: number }) => {
    const { updatedNodes, removedNodes } = removeNodes(treeData, dragIds);
    const newTree = insertNodes(updatedNodes, parentId, removedNodes, index);

    setTreeData(newTree);
    console.log('Updated Tree Structure:', JSON.stringify(newTree, null, 2));
  };

  // todo improve loading and error handling
  /*   if (loading && treeData.length === 0) return <div>Loading tree...</div>;
  if (error) return <div>{error}</div>;
  if (!treeData || treeData.length === 0) return <div>No Data</div>;
   */

  return (
    <div className={styles['tree-container']}>
      <Tree
        data={treeData}
        openByDefault={true}
        onMove={handleMove}
        width={600}
        height={1000}
        indent={24}
        rowHeight={36}
        overscanCount={1}
        padding={25}
      >
        {Node}
      </Tree>
    </div>
  );
};

export default TreeView;
