import { render, screen } from '@testing-library/react';
import { useStore } from '../../../store/useStore';
import TreeView from '../TreeView';
import TreeNode from '../../TreeNode';
import { DependencyContext, TreeContext } from '../../../DnD/context';
import { faker } from '@faker-js/faker/.';

jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

jest.mock('../../TreeNode', () => jest.fn(() => <div>Mock TreeNode</div>));

const mockDispatch = jest.fn();
const mockRegisterTreeItem = jest.fn(() => jest.fn());
const mockCombine = jest.fn();
const mockMonitorForElements = jest.fn(() => jest.fn());
const mockExtractInstruction = jest.fn();

jest.mock('@atlaskit/pragmatic-drag-and-drop/combine', () => ({
  combine: jest.fn((...args) => mockCombine(...args)),
}));

jest.mock('@atlaskit/pragmatic-drag-and-drop/element/adapter', () => ({
  monitorForElements: jest.fn((...args) => mockMonitorForElements(...args)),
}));

const mockTreeData = [
  { id: faker.string.uuid(), label: faker.lorem.word(1), children: [] },
  { id: faker.string.uuid(), label: faker.lorem.word(1), children: [] },
];

const mockUseStore = {
  treeData: mockTreeData,
  fetchAndSetTreeData: jest.fn(),
  loading: false,
  error: null,
  dispatch: mockDispatch,
  getChildrenOfItem: jest.fn(),
  uniqueContextId: Symbol(faker.string.uuid()),
  getPathToItem: jest.fn(),
  getMoveTargets: jest.fn(),
};

const renderTreeView = () =>
  render(
    <TreeContext.Provider
      value={{
        dispatch: mockDispatch,
        uniqueContextId: mockUseStore.uniqueContextId,
        getPathToItem: mockUseStore.getPathToItem,
        getMoveTargets: mockUseStore.getMoveTargets,
        getChildrenOfItem: mockUseStore.getChildrenOfItem,
        registerTreeItem: mockRegisterTreeItem,
      }}
    >
      <DependencyContext.Provider
        value={{
          DropIndicator: jest.fn(),
          attachInstruction: jest.fn(),
          extractInstruction: mockExtractInstruction,
        }}
      >
        <TreeView />
      </DependencyContext.Provider>
    </TreeContext.Provider>
  );

describe('TreeView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as jest.Mock).mockReturnValue(mockUseStore);
  });

  it('renders loading state when loading is true', () => {
    (useStore as jest.Mock).mockReturnValue({
      ...mockUseStore,
      loading: true,
      treeData: [],
    });

    renderTreeView();
    expect(screen.getByText('Loading tree...')).toBeInTheDocument();
  });

  it('renders error state when error exists', () => {
    const error = 'Failed to load';
    (useStore as jest.Mock).mockReturnValue({
      ...mockUseStore,
      error: error,
    });

    renderTreeView();
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('renders "No Data" when treeData is empty', () => {
    (useStore as jest.Mock).mockReturnValue({
      ...mockUseStore,
      treeData: [],
    });

    renderTreeView();
    expect(screen.getByText('No Data')).toBeInTheDocument();
  });

  it('renders tree nodes when treeData is available', () => {
    renderTreeView();

    mockTreeData.forEach((node) => {
      expect(TreeNode).toHaveBeenCalledWith(expect.objectContaining({ node }), expect.anything());
    });
  });

  it('fetches tree data on mount', () => {
    renderTreeView();
    expect(mockUseStore.fetchAndSetTreeData).toHaveBeenCalledTimes(1);
  });
});
