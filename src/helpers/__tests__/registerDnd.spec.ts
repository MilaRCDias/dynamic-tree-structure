import { faker } from '@faker-js/faker/.';
import { createTreeItemRegistry } from '../registerDnd';

describe('createTreeItemRegistry', () => {
  it('should initialize an empty registry', () => {
    const { registry } = createTreeItemRegistry();
    expect(registry.size).toBe(0);
  });

  it('should register a tree item correctly', () => {
    const { registry, registerTreeItem } = createTreeItemRegistry();
    const mockItemId = faker.string.uuid();
    const mockElement = document.createElement('div');
    const mockActionMenuTrigger = document.createElement('button');

    registerTreeItem({
      itemId: mockItemId,
      element: mockElement,
      actionMenuTrigger: mockActionMenuTrigger,
    });

    expect(registry.size).toBe(1);
    expect(registry.has(mockItemId)).toBe(true);
    expect(registry.get(mockItemId)).toEqual({
      element: mockElement,
      actionMenuTrigger: mockActionMenuTrigger,
    });
  });

  it('should remove a tree item on cleanup', () => {
    const { registry, registerTreeItem } = createTreeItemRegistry();
    const mockItemId = faker.string.uuid();
    const mockElement = document.createElement('div');
    const mockActionMenuTrigger = document.createElement('button');

    const cleanup = registerTreeItem({
      itemId: mockItemId,
      element: mockElement,
      actionMenuTrigger: mockActionMenuTrigger,
    });

    expect(registry.size).toBe(1);

    cleanup();

    expect(registry.size).toBe(0);
    expect(registry.has(mockItemId)).toBe(false);
  });

  it('should handle multiple registrations and cleanups correctly', () => {
    const { registry, registerTreeItem } = createTreeItemRegistry();
    const mockItemId1 = faker.string.uuid();
    const mockItemId2 = faker.string.uuid();

    const mockElement1 = document.createElement('div');
    const mockActionMenuTrigger1 = document.createElement('button');
    const mockElement2 = document.createElement('span');
    const mockActionMenuTrigger2 = document.createElement('a');

    const cleanup1 = registerTreeItem({
      itemId: mockItemId1,
      element: mockElement1,
      actionMenuTrigger: mockActionMenuTrigger1,
    });
    const cleanup2 = registerTreeItem({
      itemId: mockItemId2,
      element: mockElement2,
      actionMenuTrigger: mockActionMenuTrigger2,
    });

    expect(registry.size).toBe(2);
    expect(registry.has(mockItemId1)).toBe(true);
    expect(registry.has(mockItemId2)).toBe(true);

    cleanup1();

    expect(registry.size).toBe(1);
    expect(registry.has(mockItemId1)).toBe(false);
    expect(registry.has(mockItemId2)).toBe(true);

    cleanup2();

    expect(registry.size).toBe(0);
    expect(registry.has(mockItemId2)).toBe(false);
  });
});
