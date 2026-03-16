import { ArrayFieldBase, type ArrayFieldBaseProps } from 'ra-core';

import type { FieldProps } from './types';

export const ArrayField = ArrayFieldBase;

export interface ArrayFieldProps<
    RecordType extends Record<string, any> = Record<string, any>,
> extends ArrayFieldBaseProps<RecordType>,
        FieldProps<RecordType> {}
