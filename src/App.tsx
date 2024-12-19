import { useEffect } from 'react';
import Header from './components/Header/Header';
import { useStore } from './store/useStore';

function App() {
  const { treeData, fetchAndSetTreeData, loading, error } = useStore();

  useEffect(() => {
    fetchAndSetTreeData();
  }, [fetchAndSetTreeData]);

  if (loading) return <div>Loading tree data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!treeData) return <div>No Data</div>;

  console.log('treeData:', treeData);
  return (
    <div>
      <Header />
      <div>{JSON.stringify(treeData)}</div>
    </div>
  );
}

export default App;
