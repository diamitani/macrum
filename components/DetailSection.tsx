
import React, { useState } from 'react';
import { PlusIcon } from './icons';
import { Button } from './shared/Button';
import { Card } from './shared/Card';

interface DetailSectionProps<T> {
  title: string;
  Icon: React.ElementType;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onAddItem: () => void;
  emptyStateMessage: string;
  addModal?: React.ReactNode; // Optional: pass modal component directly
}

export function DetailSection<T,>({
  title,
  Icon,
  items,
  renderItem,
  onAddItem,
  emptyStateMessage,
}: DetailSectionProps<T>) {
  return (
    <Card className="mb-6 bg-white">
      <div className="px-4 py-3 border-b border-neutral-light flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-darkest flex items-center">
          <Icon className="w-5 h-5 mr-2 text-primary" />
          {title}
        </h3>
        <Button onClick={onAddItem} size="sm" variant="outline" leftIcon={<PlusIcon />}>
          Add {title.slice(0, -1)}
        </Button>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <p className="text-neutral-dark text-sm">{emptyStateMessage}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, index) => renderItem(item, index))}
          </ul>
        )}
      </div>
    </Card>
  );
}
    