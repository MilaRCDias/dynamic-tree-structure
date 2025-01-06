import { TreeLeafNode, TreeNode } from '../../store/useStore';
import { getTreeData, getLeafData } from '../getData';
import { faker } from '@faker-js/faker';

const mockTreeData = [{ id: faker.string.uuid(), label: faker.lorem.words(1), children: [] }];
const mockLeafData = { id: faker.string.uuid(), description: faker.lorem.words(3) };

const mockApiDataResponse = (data: TreeNode[] | TreeLeafNode | object, status = 200, ok = true, options = {}) => ({
  ok: ok,
  status: status,
  json: () => Promise.resolve(data),
  ...options,
});

describe('API Functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTreeData', () => {
    it('fetches tree data successfully', async () => {
      global.fetch = jest.fn().mockResolvedValue(mockApiDataResponse(mockTreeData));
      const result = await getTreeData();

      expect(result).toEqual(mockTreeData);
    });

    it('throws an error when response is not ok', async () => {
      global.fetch = jest.fn().mockResolvedValue(mockApiDataResponse({}, 500, false));

      await expect(getTreeData()).rejects.toThrow('Error fetching tree data:');
    });
  });

  describe('getLeafData', () => {
    it('fetches leaf data successfully', async () => {
      const leafId = faker.string.uuid();
      global.fetch = jest.fn().mockResolvedValue(mockApiDataResponse(mockLeafData));

      const result = await getLeafData(leafId);
      expect(result).toEqual(mockLeafData);
    });

    it('throws an error when response is not ok', async () => {
      const leafId = faker.string.uuid();
      global.fetch = jest.fn().mockResolvedValue(mockApiDataResponse({}, 404, false));
      await expect(getLeafData(leafId)).rejects.toThrow(`Error fetching entry ${leafId}:`);
    });
  });
});
