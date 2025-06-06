import * as React from 'react';
import { isValidElement, ReactElement, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ComponentsOverrides,
    Tab as MuiTab,
    TabProps as MuiTabProps,
    Stack,
    styled,
} from '@mui/material';
import { ResponsiveStyleValue, useThemeProps } from '@mui/system';
import { useTranslate, RaRecord, useSplatPathBase } from 'ra-core';
import clsx from 'clsx';

import { Labeled } from '../Labeled';

/**
 * Tab element for the TabbedShowLayout.
 *
 * The `<Tab>` component accepts the following props:
 *
 * - label: The string displayed for each tab
 * - icon: The icon to show before the label (optional). Must be a component.
 * - path: The string used for custom urls
 *
 * It is also available as TabbedShowLayout.Tab.
 *
 * @example
 *     // in src/posts.js
 *     import * as React from "react";
 *     import FavoriteIcon from '@mui/icons-material/Favorite';
 *     import PersonPinIcon from '@mui/icons-material/PersonPin';
 *     import { Show, TabbedShowLayout, TextField } from 'react-admin';
 *
 *     export const PostShow = () => (
 *         <Show>
 *             <TabbedShowLayout>
 *                 <TabbedShowLayout.Tab label="Content" icon={<FavoriteIcon />}>
 *                     <TextField source="title" />
 *                     <TextField source="subtitle" />
 *                </TabbedShowLayout.Tab>
 *                 <TabbedShowLayout.Tab label="Metadata" icon={<PersonIcon />} path="metadata">
 *                     <TextField source="category" />
 *                </TabbedShowLayout.Tab>
 *             </TabbedShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import * as React from "react";
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
export const Tab = (inProps: TabProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        children,
        contentClassName,
        context,
        count,
        className,
        divider,
        icon,
        iconPosition,
        label,
        record,
        spacing = 1,
        syncWithLocation = true,
        value,
        ...rest
    } = props;
    const translate = useTranslate();
    const location = useLocation();
    const splatPathBase = useSplatPathBase();
    const newPathName =
        value == null || value === ''
            ? splatPathBase
            : `${splatPathBase}/${value}`;
    const propsForLink = {
        component: Link,
        to: { ...location, pathname: newPathName },
    };

    const renderHeader = () => {
        let tabLabel =
            typeof label === 'string' ? translate(label, { _: label }) : label;
        if (count !== undefined) {
            tabLabel = (
                <span>
                    {tabLabel} ({count})
                </span>
            );
        }

        return (
            <MuiTab
                key={`tab-header-${value}`}
                label={tabLabel}
                value={value}
                icon={icon}
                iconPosition={iconPosition}
                className={clsx('show-tab', className)}
                {...(syncWithLocation ? propsForLink : {})} // to avoid TypeScript screams, see https://github.com/mui/material-ui/issues/9106#issuecomment-451270521
                {...rest}
            />
        );
    };

    const renderContent = () => (
        <Root className={contentClassName} spacing={spacing} divider={divider}>
            {React.Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <Labeled
                        key={field.props.source}
                        className={clsx(
                            'ra-field',
                            field.props.source &&
                                `ra-field-${field.props.source}`,
                            TabClasses.row,
                            field.props.className
                        )}
                    >
                        {field}
                    </Labeled>
                ) : null
            )}
        </Root>
    );

    return context === 'header' ? renderHeader() : renderContent();
};

const PREFIX = 'RaTab';

export const TabClasses = {
    row: `${PREFIX}-row`,
};

const Root = styled(Stack, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    [`& .${TabClasses.row}`]: {
        display: 'inline',
    },
}));

export interface TabProps extends Omit<MuiTabProps, 'children'> {
    children: ReactNode;
    contentClassName?: string;
    context?: 'header' | 'content';
    count?: ReactNode;
    className?: string;
    divider?: ReactNode;
    icon?: ReactElement;
    label: string | ReactElement;
    path?: string;
    record?: RaRecord;
    spacing?: ResponsiveStyleValue<number | string>;
    syncWithLocation?: boolean;
    value?: string | number;
}

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaTab: 'root' | 'row';
    }

    interface ComponentsPropsList {
        RaTab: Partial<TabProps>;
    }

    interface Components {
        RaTab?: {
            defaultProps?: ComponentsPropsList['RaTab'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaTab'];
        };
    }
}
