import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from 'ra-language-english';
import fr from 'ra-language-french';
import { Box } from '@mui/material';

import { SimpleListConfigurable } from './SimpleListConfigurable';
import { Inspector, InspectorButton } from '../../preferences';
import { LocalesMenuButton } from '../../button/LocalesMenuButton';
import { AdminContext } from '../../AdminContext';

export default { title: 'ra-ui-materialui/list/SimpleListConfigurable' };

const data = [
    {
        id: 1,
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        year: 1869,
    },
    {
        id: 2,
        title: 'Pride and Predjudice',
        author: 'Jane Austen',
        year: 1813,
    },
    {
        id: 3,
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        year: 1890,
    },
    {
        id: 4,
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        year: 1943,
    },
];

const translations = { en, fr };
const i18nProvider = polyglotI18nProvider(locale => translations[locale], 'en');

export const Basic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Inspector />
        <Box display="flex" justifyContent="flex-end">
            <LocalesMenuButton
                languages={[
                    { locale: 'en', name: 'English' },
                    { locale: 'fr', name: 'Français' },
                ]}
            />
            <InspectorButton />
        </Box>
        <Box p={2}>
            <SimpleListConfigurable
                resource="books"
                data={data}
                primaryText={record => record.title}
                secondaryText={record => record.author}
                tertiaryText={record => record.year}
            />
        </Box>
    </AdminContext>
);
