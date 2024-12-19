import React from 'react';
import { TreeNode as ITreeNode, useStore } from '../../store/useStore';
import styles from './TreeNode.module.scss';

export interface TreeNodeProps {
  node: ITreeNode;
}

// basic rendering
const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const { fetchLeafData, leafData, leafError } = useStore();

  const isLeaf = !node.children || node.children.length === 0;
  const isOpenLeaf = isLeaf && leafData && leafData.id === node.id;
  const isLeafError = isLeaf && leafError && leafError.id === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLeaf) {
      fetchLeafData(node.id);
    }
  };

  return (
    <li className={`${styles.node} ${isLeaf ? styles.leaf : ''}`} onClick={handleClick}>
      <div className={styles.labelContainer}>
        <span className={styles.label}>
          {node.label}
          {isLeaf && <span> •</span>}
        </span>
      </div>
      {isLeafError && <div className={styles.error}>{leafError.message}</div>}
      {isOpenLeaf && (
        <div className={styles.additionalData}>
          <p>
            <strong>Description:</strong> {leafData.description}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(leafData.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Created By:</strong> {leafData.createdBy}
          </p>
          <p>
            <strong>Last Modified At:</strong> {new Date(leafData.lastModifiedAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Modified By:</strong> {leafData.lastModifiedBy}
          </p>
        </div>
      )}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TreeNode;
