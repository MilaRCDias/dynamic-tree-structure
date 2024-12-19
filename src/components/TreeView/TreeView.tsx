import React, { useEffect } from 'react';
import styles from './TreeView.module.scss';
import { useStore } from '../../store/useStore';
import TreeNode from '../TreeNode';

const TreeView: React.FC = () => {
  const { treeData, fetchAndSetTreeData, loading, error } = useStore();

  useEffect(() => {
    fetchAndSetTreeData();
  }, [fetchAndSetTreeData]);

  // todo improve loading and error handling
  if (loading && treeData.length === 0) return <div>Loading tree...</div>;
  if (error) return <div>{error}</div>;
  if (!treeData || treeData.length === 0) return <div>No Data</div>;

  return (
    <div className={styles['tree-container']}>
      <ul className={styles.tree}>
        {treeData.map((node) => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
};

export default TreeView;
