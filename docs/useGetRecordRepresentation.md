---
layout: default
title: "The useGetRecordRepresentation Hook"
---

# `useGetRecordRepresentation`

Get a function that returns the record representation, leveraging the [`<Record recordRepresentation>`](./Resource.md#recordrepresentation) prop.

You can also use the component version: [`<RecordRepresentation>`](./RecordRepresentation.md).

## Usage

{% raw %}
```tsx
// in src/posts/PostBreadcrumbs.tsx
import * as React from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { Link, useGetRecordRepresentation, useRecordContext } from 'react-admin';

export const PostBreadcrumbs = () => {
    const record = useRecordContext();
    const getRecordRepresentation = useGetRecordRepresentation('posts');
    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/">
                    Home
                </Link>
                <Link underline="hover" color="inherit" to="/posts">
                    Posts
                </Link>
                <Typography sx={{ color: "text.primary" }}>
                    {getRecordRepresentation(record)}
                </Typography>
            </Breadcrumbs>
        </div>
    );
}

// in src/posts/PostEdit.tsx
import { EditBase, EditView, SimpleForm, TextInput } from 'react-admin';
import { PostBreadcrumbs } from './PostBreadcrumbs';

const PostEdit = () => (
    <EditBase>
        <PostBreadcrumbs />
        <EditView>
            <SimpleForm>
                <TextInput source="title" />
            </SimpleForm>
        </EditView>
    </EditBase>
)
```
{% endraw %}

## Default Representation

When [`<Resource recordRepresentation>`](./Resource.md#recordrepresentation) is not defined, `useGetRecordRepresentation` will return the first non-empty field from this list:  
1. `name`
2. `title`
3. `label`
4. `reference`
5. `id`



## Options

Here are all the options you can set on the `useGetRecordRepresentation` hook:

| Prop       | Required | Type       | Default | Description           |
| ---------- | -------- | ---------- | ------- | ----------------------|
| `resource` | Required | `string`   |         | The record's resource |

## `resource`

The record's resource.
