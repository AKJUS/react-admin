import * as React from 'react';
import { ArrayFieldBase, type ArrayFieldBaseProps, genericMemo } from 'ra-core';

import type { FieldProps } from './types';

const ArrayFieldImpl = <
    RecordType extends Record<string, any> = Record<string, any>,
>(
    props: ArrayFieldProps<RecordType>
) => <ArrayFieldBase {...props} />;

ArrayFieldImpl.displayName = 'ArrayFieldImpl';

export const ArrayField = genericMemo(ArrayFieldImpl);

export interface ArrayFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends ArrayFieldBaseProps<RecordType>,
        FieldProps<RecordType> {}
