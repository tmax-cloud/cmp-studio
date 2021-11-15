import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { JSONSchema7 } from 'json-schema';
import DynamicForm from '@renderer/components/topology/state/form';

describe('MapField component test', () => {
  const fakeSchema = {
    properties: {
      vpc_id: {
        type: 'string',
        optional: true,
      },
      tags: {
        type: 'array',
        items: {
          type: 'object',
        },
      },
    },
  };
  const fakeUiSchema = { tags: { 'ui:field': 'MapField' } };
  const component = () =>
    render(
      <DynamicForm schema={fakeSchema as JSONSchema7} uiSchema={fakeUiSchema} />
    );
  it('add item button test', async () => {
    const render = component();
    const itemAddButton = await render.findByTestId('add-item-button');
    userEvent.click(itemAddButton);
    const deleteButton = await render.findByTestId('delete-item-button');
    expect(deleteButton).not.toBeNull();
  });

  it('delete item button test', async () => {
    const render = component();

    const itemDeleteButton = await render.findByTestId('delete-item-button');
    const ItemCount = await render.queryAllByTestId('delete').length;

    userEvent.click(itemDeleteButton);

    const changedItemCount = await render.queryAllByTestId('delete').length;
    expect(changedItemCount).toHaveLength(ItemCount - 1);
  });
});
