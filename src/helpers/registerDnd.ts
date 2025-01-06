type CleanupFn = () => void;

export function createTreeItemRegistry() {
  const registry = new Map<string, { element: HTMLElement; actionMenuTrigger: HTMLElement }>();

  const registerTreeItem = ({
    itemId,
    element,
    actionMenuTrigger,
  }: {
    itemId: string;
    element: HTMLElement;
    actionMenuTrigger: HTMLElement;
  }): CleanupFn => {
    registry.set(itemId, { element, actionMenuTrigger });
    return () => {
      registry.delete(itemId);
    };
  };

  return { registry, registerTreeItem };
}
