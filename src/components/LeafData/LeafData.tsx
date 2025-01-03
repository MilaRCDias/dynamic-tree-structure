import React, { memo } from 'react';
import { TreeLeafNode } from '../../store/useStore';
import styles from './LeafData.module.scss';
import { indentPerLevel } from '../TreeNode/TreeNode';

interface LeafDataProps {
  leafData: TreeLeafNode | null;
  level: number;
  onClose: () => void;
}

const LeafData: React.FC<LeafDataProps> = ({ leafData, level, onClose }) => {
  if (!leafData) return null;

  return (
    <div className={styles.additionalData} style={{ marginLeft: level * indentPerLevel }}>
      <button onClick={onClose} className={styles.closeButton} aria-label="Close additional data">
        X
      </button>
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
  );
};

export default memo(LeafData);
