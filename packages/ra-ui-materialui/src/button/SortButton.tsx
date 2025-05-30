import * as React from 'react';
import { memo } from 'react';
import clsx from 'clsx';
import {
    Button,
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    useMediaQuery,
    type Theme,
    type SxProps,
} from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import SortIcon from '@mui/icons-material/Sort';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    useListSortContext,
    useTranslate,
    useTranslateLabel,
    shallowEqual,
} from 'ra-core';

/**
 * A button allowing to change the sort field and order.
 *
 * To be used inside a ListContext (e.g. inside a <List> or <ReferenceManyField>)
 *
 * Expects one 'fields' prop, containing an array of field strings that shall
 * be used and displayed for sorting.
 *
 * When users clicks on the <SortButton>, they see a dropdown list with the
 * proposed sorting fields. Once they click on one of these fields, the related
 * list refreshes, re-sorted.
 *
 * @example
 *
 * import * as React from 'react';
 * import { TopToolbar, SortButton, CreateButton, ExportButton } from 'react-admin';
 *
 * const ListActions = () => (
 *     <TopToolbar>
 *         <SortButton fields={['reference', 'sales', 'stock']} />
 *         <CreateButton />
 *         <ExportButton />
 *     </TopToolbar>
 * );
 */
const SortButton = (inProps: SortButtonProps) => {
    const props = useThemeProps({
        name: PREFIX,
        props: inProps,
    });
    const {
        fields,
        label = 'ra.sort.sort_by',
        icon = defaultIcon,
        sx,
        className,
        resource: resourceProp,
    } = props;
    const {
        resource: resourceFromContext,
        sort,
        setSort,
    } = useListSortContext();
    const resource = resourceProp || resourceFromContext;
    const translate = useTranslate();
    const translateLabel = useTranslateLabel();
    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChangeSort = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => {
        const field = event.currentTarget.dataset.sort;
        if (!field) {
            throw new Error(
                '<SortButton> MenuItems should have a data-sort attribute'
            );
        }
        setSort({
            field,
            order: field === sort.field ? inverseOrder(sort.order) : 'ASC',
        });
        setAnchorEl(null);
    };

    const fieldLabel = translateLabel({
        resource,
        source: sort.field,
    });
    const buttonLabel = translate(label, {
        field: fieldLabel,
        field_lower_first:
            typeof fieldLabel === 'string'
                ? fieldLabel.charAt(0).toLowerCase() + fieldLabel.slice(1)
                : undefined,
        order: translate(`ra.sort.${sort.order}`),
        _: label,
    });

    return (
        <Root sx={sx} className={clsx(className, classNames.root)}>
            {isXSmall ? (
                <Tooltip title={buttonLabel}>
                    <IconButton
                        aria-label={buttonLabel}
                        color="primary"
                        onClick={handleClick}
                        size="large"
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            ) : (
                <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    color="primary"
                    onClick={handleClick}
                    startIcon={icon}
                    endIcon={<ArrowDropDownIcon />}
                    size="small"
                >
                    {buttonLabel}
                </Button>
            )}
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {fields.map(field => (
                    <MenuItem
                        onClick={handleChangeSort}
                        data-sort={field}
                        key={field}
                    >
                        {translateLabel({
                            resource,
                            source: field,
                        })}{' '}
                        {translate(
                            `ra.sort.${
                                sort.field === field
                                    ? inverseOrder(sort.order)
                                    : 'ASC'
                            }`
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </Root>
    );
};

const defaultIcon = <SortIcon />;

const inverseOrder = (sort: string) => (sort === 'ASC' ? 'DESC' : 'ASC');

const arePropsEqual = (prevProps, nextProps) =>
    shallowEqual(prevProps.fields, nextProps.fields);

export interface SortButtonProps {
    className?: string;
    fields: string[];
    icon?: React.ReactNode;
    label?: string;
    resource?: string;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaSortButton';

const classNames = {
    root: `${PREFIX}-root`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    [`.${classNames.root}`]: {},
    '& .MuiButton-sizeSmall': {
        // fix for icon misalignment on small buttons, see https://github.com/mui/material-ui/pull/30240
        lineHeight: 1.5,
    },
    '& .MuiButton-endIcon': { ml: 0 },
});

export default memo(SortButton, arePropsEqual);

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSortButton: 'root';
    }

    interface ComponentsPropsList {
        RaSortButton: Partial<SortButtonProps>;
    }

    interface Components {
        RaSortButton?: {
            defaultProps?: ComponentsPropsList['RaSortButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSortButton'];
        };
    }
}
