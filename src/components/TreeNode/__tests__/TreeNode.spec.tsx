import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { faker } from '@faker-js/faker';
import { useStore } from '../../../store/useStore';
import TreeNode, { TreeNodeProps } from '../TreeNode';
import { TreeContext, DependencyContext } from '../../../DnD/context';
import { Mode } from '../../../helpers/getItemMode';

jest.mock('../../../store/useStore', () => ({
  useStore: jest.fn(),
}));

const mockDispatch = jest.fn();
const mockToggleHighlight = jest.fn();
const mockRegisterTreeItem = jest.fn(() => jest.fn());
const mockAttachInstruction = jest.fn();
const mockExtractInstruction = jest.fn();
const mockDropIndicator = () => <div>Drop Indicator</div>;

const mockNode = {
  id: faker.string.uuid(),
  label: faker.lorem.words(1),
  children: [{ id: faker.string.uuid(), label: faker.lorem.words(2), children: [] }],
};

const defaultProps: TreeNodeProps = {
  node: mockNode,
  mode: Mode.Standart,
  level: 0,
  index: 0,
};

const mockUseStore = {
  fetchLeafData: jest.fn(),
  leafData: null,
  leafError: null,
  toggleHighlight: mockToggleHighlight,
  highlightedNodes: new Set(),
};

const renderWithProviders = (cmp: React.ReactElement) => {
  return render(
    <TreeContext.Provider
      value={{
        dispatch: mockDispatch,
        uniqueContextId: Symbol(faker.string.uuid()),
        getPathToItem: jest.fn(),
        getMoveTargets: jest.fn(),
        getChildrenOfItem: jest.fn(),
        registerTreeItem: mockRegisterTreeItem,
      }}
    >
      <DependencyContext.Provider
        value={{
          DropIndicator: mockDropIndicator,
          attachInstruction: mockAttachInstruction,
          extractInstruction: mockExtractInstruction,
        }}
      >
        {cmp}
      </DependencyContext.Provider>
    </TreeContext.Provider>
  );
};

describe('TreeNode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useStore as unknown as jest.Mock).mockReturnValue(mockUseStore);
  });

  it('renders a tree node with its label', () => {
    renderWithProviders(<TreeNode {...defaultProps} />);
    expect(screen.getByText(mockNode.label)).toBeInTheDocument();
  });

  it('highlights the node when clicked', () => {
    renderWithProviders(<TreeNode {...defaultProps} />);
    const button = screen.getByTestId(`tree-item-${mockNode.id}`);
    fireEvent.click(button);
    expect(mockToggleHighlight).toHaveBeenCalledWith(mockNode);
  });

  it('fetches leaf data when a leaf node is clicked', () => {
    const leafNode = { ...mockNode, children: [] };
    renderWithProviders(<TreeNode {...defaultProps} node={leafNode} />);
    const button = screen.getByTestId(`tree-item-${leafNode.id}`);
    fireEvent.click(button);
    expect(mockUseStore.fetchLeafData).toHaveBeenCalledWith(leafNode.id);
  });

  it('renders children nodes if they exist', () => {
    renderWithProviders(<TreeNode {...defaultProps} />);
    mockNode.children.forEach((child) => {
      expect(screen.getByText(child.label)).toBeInTheDocument();
    });
  });

  it('renders LeafData when a leaf node is expanded', () => {
    const mockDescription = faker.lorem.words(3);
    (useStore as unknown as jest.Mock).mockReturnValue({
      ...mockUseStore,
      leafData: { id: mockNode.id, description: mockDescription },
    });

    renderWithProviders(<TreeNode {...defaultProps} node={{ ...mockNode, children: [] }} />);

    expect(screen.getByText((content) => content.includes(mockDescription))).toBeInTheDocument();
  });

  it('removes highlight on second click', () => {
    const highlightedSet = new Set([mockNode.id]);
    (useStore as unknown as jest.Mock).mockReturnValue({
      ...mockUseStore,
      highlightedNodes: highlightedSet,
    });

    renderWithProviders(<TreeNode {...defaultProps} />);
    const button = screen.getByTestId(`tree-item-${mockNode.id}`);
    fireEvent.click(button);
    expect(mockToggleHighlight).toHaveBeenCalledWith(mockNode);
  });

  it('displays an error message when leafError exists', async () => {
    const leafId = mockNode.children[0].id;
    const mockErroMessage = 'Error fetching leaf data';
    const mockFetchLeafData = jest.fn(() => {
      (useStore as unknown as jest.Mock).mockReturnValueOnce({
        ...mockUseStore,
        leafError: { id: leafId, message: mockErroMessage },
      });
    });

    (useStore as unknown as jest.Mock).mockReturnValue({
      ...mockUseStore,
      fetchLeafData: mockFetchLeafData,
      leafError: { id: leafId, message: mockErroMessage },
    });

    renderWithProviders(<TreeNode {...defaultProps} />);

    const button = screen.getByTestId(`tree-item-${leafId}`);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(mockErroMessage)).toBeInTheDocument();
    });
  });
});
