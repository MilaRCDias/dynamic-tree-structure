import { v4 as uuidv4 } from 'uuid';
import { addIdsToTree } from '../mapData';
import { TreeNodeData } from '../../store/useStore';
import { faker } from '@faker-js/faker/.';

const mockId = faker.string.uuid();
const mockExistingId = faker.string.uuid();

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('mapData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (uuidv4 as jest.Mock).mockReturnValue(mockId);
  });

  it('assigns new UUIDs to nodes without IDs', () => {
    const input: TreeNodeData[] = [
      { label: faker.lorem.word(1), children: [] },
      { id: mockExistingId, label: faker.lorem.word(1), children: [] },
    ];

    const result = addIdsToTree(input);

    expect(result).toEqual([
      { children: [], id: mockId, label: faker.lorem.word(1) },
      { id: mockExistingId, label: faker.lorem.word(1), children: [] },
    ]);
    expect(uuidv4).toHaveBeenCalledTimes(1);
  });

  it('keeps existing IDs intact', () => {
    const input: TreeNodeData[] = [{ id: mockExistingId, label: faker.lorem.word(1), children: [] }];

    const result = addIdsToTree(input);

    expect(result).toEqual([{ id: mockExistingId, label: faker.lorem.word(1), children: [] }]);
    expect(uuidv4).not.toHaveBeenCalled();
  });

  it('recursively assigns IDs to parent and child nodes', () => {
    const input: TreeNodeData[] = [
      {
        label: faker.lorem.word(1),
        children: [
          { label: faker.lorem.word(1), children: [] },
          { label: faker.lorem.word(1), children: [] },
        ],
      },
    ];

    const result = addIdsToTree(input);

    expect(result).toEqual([
      {
        id: mockId,
        label: faker.lorem.word(1),
        children: [
          { id: mockId, label: faker.lorem.word(1), children: [] },
          { id: mockId, label: faker.lorem.word(1), children: [] },
        ],
      },
    ]);
    expect(uuidv4).toHaveBeenCalledTimes(3);
  });

  it('handles an empty input array', () => {
    const input: TreeNodeData[] = [];

    const result = addIdsToTree(input);

    expect(result).toEqual([]);
    expect(uuidv4).not.toHaveBeenCalled();
  });
});
