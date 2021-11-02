import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import DynamicForm from '../../../renderer/components/form';
import preDefinedData from '../../../renderer/components/form/utils/preDefinedData';

describe('form component test', () => {
  const fakeSchema = {
    properties: {
      arn: {
        type: 'string',
        computed: true,
      },
      certificate_authority_arn: {
        type: 'string',
        optional: true,
      },
      certificate_body: {
        type: 'string',
        optional: true,
      },
      certificate_chain: {
        type: 'string',
        optional: true,
      },
      domain_name: {
        type: 'string',
        optional: true,
        computed: true,
      },
      // domain_validation_options: {
      //   type: 'array',
      //   computed: true,
      //   items: {
      //     type: [
      //       'object',
      //       {
      //         domain_name: 'string',
      //         resource_record_name: 'string',
      //         resource_record_type: 'string',
      //         resource_record_value: 'string',
      //       },
      //     ],
      //   },
      // },
      id: {
        type: 'string',
        optional: true,
        computed: true,
      },
      private_key: {
        type: 'string',
        optional: true,
        sensitive: true,
      },
      status: {
        type: 'string',
        computed: true,
      },
      // subject_alternative_names: {
      //   type: 'array',
      //   optional: true,
      //   computed: true,
      //   items: {
      //     type: 'string',
      //   },
      // },
      // tags: {
      //   type: 'map',
      //   optional: true,
      //   items: {
      //     type: 'string',
      //   },
      // },
      // validation_emails: {
      //   type: 'array',
      //   computed: true,
      //   items: {
      //     type: 'string',
      //   },
      // },
      validation_method: {
        type: 'string',
        optional: true,
        computed: true,
      },
      // options: {
      //   nesting_mode: 'Item',
      //   max_items: 1,
      //   properties: {
      //     certificate_transparency_logging_preference: {
      //       type: 'string',
      //       optional: true,
      //     },
      //   },
      //   required: [],
      // },
    },
    required: [],
    title: 'resource-aws_acm_certificate',
  };
  const component = () =>
    render(<DynamicForm schema={preDefinedData(fakeSchema).fixedSchema} />);

  it('add item button test', async () => {
    const render = component();

    const itemAddButton = await render.findByTestId('add-item-button');
    fireEvent.click(itemAddButton);
    const itemDeleteButton = await render.findByTestId('delete-item-button');
    expect(itemDeleteButton).toBeVisible();
  });

  it('item delete test', async () => {
    const render = component();

    const itemDeleteButton = await render.findByTestId('delete-item-button');
    const ItemCount = await render.queryAllByTestId('delete').length;

    fireEvent(itemDeleteButton, new MouseEvent('click'));

    const changedItemCount = await render.queryAllByTestId('delete').length;
    expect(changedItemCount).toHaveLength(ItemCount - 1);
  });
});
