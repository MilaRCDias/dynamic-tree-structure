const TREE_DATA_URL = process.env.REACT_APP_TREE_DATA_URL || 'https://ubique.img.ly/frontend-tha/data.json';
const LEAF_DATA_URL = process.env.REACT_APP_LEAF_DATA_URL || 'https://ubique.img.ly/frontend-tha/entries/';

// todo: include zod for validation
export async function getTreeData() {
  const response = await fetch(TREE_DATA_URL);

  if (!response.ok) {
    throw new Error(`Error fetching tree data: ${response.statusText}`);
  }
  return await response.json();
}

export async function getLeafData(id: string) {
  const url = `${LEAF_DATA_URL}${id}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching entry ${id}: ${response.statusText}`);
  }
  return await response.json();
}
