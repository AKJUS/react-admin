---
layout: default
title: "The ArrayFieldBase Component"
---

# `<ArrayFieldBase>`

`<ArrayFieldBase>` renders an embedded array of objects.
`<ArrayFieldBase>` is a headless component, handling only the list logic. This allows you to use any UI library for the render. For a Material UI version, see [`<ArrayField>`](./ArrayField.md).

`<ArrayFieldBase>` creates a [`ListContext`](./useListContext.md) with the field value, and renders its children components.

## Usage

`<ArrayFieldBase>` is ideal for collections of objects, e.g. `tags` and `backlinks` in the following `post` object:

```js
{
    id: 123,
    title: 'Lorem Ipsum Sit Amet',
    tags: [{ name: 'dolor' }, { name: 'sit' }, { name: 'amet' }],
    backlinks: [
        {
            uuid: '34fdf393-f449-4b04-a423-38ad02ae159e',
            date: '2012-08-10T00:00:00.000Z',
            url: 'https://example.com/foo/bar.html',
        },
        {
            uuid: 'd907743a-253d-4ec1-8329-404d4c5e6cf1',
            date: '2012-08-14T00:00:00.000Z',
            url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
        }
    ]
}
```

You can leverage `<ArrayFieldBase>` in a Show view and render the list using any component reading the list context:

{% raw %}
```jsx
import {
    ArrayFieldBase,
    RecordsIterator,
    Show,
    SimpleShowLayout,
    TextField,
} from 'react-admin';

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <ArrayFieldBase source="tags">
                <ul>
                    <RecordsIterator render={tag => <li>{tag.name}</li>} />
                </ul>
            </ArrayFieldBase>
            <ArrayFieldBase source="backlinks">
                <ul>
                    <RecordsIterator
                        render={backlink => (
                            <li>
                                <a href={backlink.url}>{backlink.url}</a>
                            </li>
                        )}
                    />
                </ul>
            </ArrayFieldBase>
        </SimpleShowLayout>
    </Show>
);
```
{% endraw %}

## Props

| Prop       | Required | Type              | Default | Description                              |
|------------|----------|-------------------|---------|------------------------------------------|
| `children` | Required | `ReactNode`       |         | The component to render the list.        |
| `filter`   | Optional | `object`          |         | The filter to apply to the list.         |
| `exporter` | Optional | `function`        | `default Exporter` | The function called by export buttons in the list context. |
| `perPage`  | Optional | `number`          | 1000    | The number of items to display per page. |
| `sort`     | Optional | `{ field, order}` |         | The sort to apply to the list.           |

`<ArrayFieldBase>` accepts the base field props `source`, `record`, and `resource`.

`<ArrayFieldBase>` relies on [`useList`](./useList.md) to filter, paginate, and sort the data, so it accepts the same props.

## `children`

`<ArrayFieldBase>` renders its `children` wrapped in a [`<ListContextProvider>`](./useListContext.md). Commonly used children are [`<RecordsIterator>`](./RecordsIterator.md), [`<WithListContext>`](./WithListContext.md), or any custom component using `useListContext()`.

{% raw %}
```jsx
import { ArrayFieldBase, WithListContext } from 'react-admin';

const BacklinksField = () => (
    <ArrayFieldBase source="backlinks">
        <WithListContext
            render={({ data }) => (
                <ul>
                    {data?.map(backlink => (
                        <li key={backlink.uuid}>{backlink.url}</li>
                    ))}
                </ul>
            )}
        />
    </ArrayFieldBase>
);
```
{% endraw %}

## `filter`

By default, `<ArrayFieldBase>` displays all the records in the embedded array. Use the `filter` prop to restrict them.

{% raw %}
```jsx
<ArrayFieldBase
    source="backlinks"
    filter={{ date: '2012-08-10T00:00:00.000Z' }}
>
    <WithListContext
        render={({ data }) => (
            <ul>
                {data?.map(backlink => (
                    <li key={backlink.uuid}>{backlink.url}</li>
                ))}
            </ul>
        )}
    />
</ArrayFieldBase>
```
{% endraw %}

## `perPage`

Because `<ArrayFieldBase>` creates a [`ListContext`](./useListContext.md), you can paginate the embedded array with any pagination UI wired to that context.

## `sort`

By default, `<ArrayFieldBase>` displays the items in the order they are stored in the field. You can use the `sort` prop to change the sort order.

{% raw %}
```jsx
<ArrayFieldBase source="tags" sort={{ field: 'name', order: 'ASC' }}>
    <ul>
        <RecordsIterator render={tag => <li>{tag.name}</li>} />
    </ul>
</ArrayFieldBase>
```
{% endraw %}
