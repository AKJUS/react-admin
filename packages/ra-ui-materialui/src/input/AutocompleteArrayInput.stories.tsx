import * as React from 'react';
import { Admin } from 'react-admin';

import CloseIcon from '@mui/icons-material/Close';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from '@mui/material';

import {
    CreateBase,
    Resource,
    TestMemoryRouter,
    required,
    testDataProvider,
    useRecordContext,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { useFormContext } from 'react-hook-form';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import {
    AutocompleteArrayInput,
    AutocompleteArrayInputProps,
} from './AutocompleteArrayInput';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { TextInput } from './TextInput';
import { useCreateSuggestionContext } from './useSupportCreateSuggestion';

export default { title: 'ra-ui-materialui/input/AutocompleteArrayInput' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider} defaultTheme="light">
        <Create
            resource="posts"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>{children}</SimpleForm>
        </Create>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper>
        <AutocompleteArrayInput
            source="roles"
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
        />
    </Wrapper>
);

export const StringChoices = () => (
    <Wrapper>
        <AutocompleteArrayInput
            source="roles"
            choices={['Admin', 'Editor', 'Moderator', 'Reviewer']}
        />
    </Wrapper>
);

export const ReadOnly = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <AutocompleteArrayInput
                    source="roles"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                    readOnly
                />
                <AutocompleteArrayInput
                    source="authors"
                    choices={[]}
                    readOnly
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Disabled = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <AutocompleteArrayInput
                    source="roles"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                    disabled
                />
                <AutocompleteArrayInput
                    source="authors"
                    choices={[]}
                    disabled
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const OnChange = ({
    onChange = (value, records) => console.log({ value, records }),
}: Pick<AutocompleteArrayInputProps, 'onChange'>) => (
    <Wrapper>
        <AutocompleteArrayInput
            source="roles"
            choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'u001', name: 'Editor' },
                { id: 'u002', name: 'Moderator' },
                { id: 'u003', name: 'Reviewer' },
            ]}
            onChange={onChange}
        />
    </Wrapper>
);

const choices = [
    { id: 'admin', name: 'Admin' },
    { id: 'u001', name: 'Editor' },
    { id: 'u002', name: 'Moderator' },
    { id: 'u003', name: 'Reviewer' },
];

const CreateRole = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');

    const handleSubmit = event => {
        event.preventDefault();
        const newOption = { id: value, name: value };
        choices.push(newOption);
        setValue('');
        onCreate(newOption);
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        label="Role name"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const OnCreateInput = () => {
    const [choices, setChoices] = React.useState<
        { id: string; name: string }[]
    >([
        { id: 'admin', name: 'Admin' },
        { id: 'u001', name: 'Editor' },
        { id: 'u002', name: 'Moderator' },
        { id: 'u003', name: 'Reviewer' },
    ]);
    return (
        <AutocompleteArrayInput
            source="roles"
            choices={choices}
            onCreate={async filter => {
                if (!filter) return;

                const newOption = {
                    id: filter,
                    name: filter,
                };
                setChoices(options => [...options, newOption]);
                // Wait until next tick to give some time for React to update the state
                await new Promise(resolve => setTimeout(resolve));
                return newOption;
            }}
            TextFieldProps={{
                placeholder: 'Start typing to create a new item',
            }}
        />
    );
};

export const OnCreate = () => (
    <Wrapper>
        <OnCreateInput />
    </Wrapper>
);

const OnCreateInputStringChoices = () => {
    const [choices, setChoices] = React.useState<string[]>([
        'Admin',
        'Editor',
        'Moderator',
        'Reviewer',
    ]);
    return (
        <AutocompleteArrayInput
            source="roles"
            choices={choices}
            onCreate={async filter => {
                if (!filter) return;

                const newOption = {
                    id: filter,
                    name: filter,
                };
                setChoices(options => [...options, filter]);
                // Wait until next tick to give some time for React to update the state
                await new Promise(resolve => setTimeout(resolve));
                return newOption;
            }}
            TextFieldProps={{
                placeholder: 'Start typing to create a new item',
            }}
        />
    );
};

export const OnCreateStringChoices = () => (
    <AdminContext
        dataProvider={testDataProvider({
            // @ts-expect-error
            create: async (resource, params) => {
                console.log(resource, params);
                return params;
            },
        })}
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Create
            resource="posts"
            record={{ roles: ['Editor', 'Moderator'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <OnCreateInputStringChoices />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const CreateProp = () => (
    <Wrapper>
        <AutocompleteArrayInput
            source="roles"
            choices={choices}
            sx={{ width: 400 }}
            create={<CreateRole />}
        />
    </Wrapper>
);

export const CreateLabel = () => (
    <Wrapper>
        <AutocompleteArrayInput
            source="roles"
            choices={choices}
            sx={{ width: 400 }}
            create={<CreateRole />}
            createLabel="Start typing to create a new item"
        />
    </Wrapper>
);

export const CreateItemLabel = () => (
    <Wrapper>
        <AutocompleteArrayInput
            source="roles"
            choices={choices}
            sx={{ width: 400 }}
            create={<CreateRole />}
            createItemLabel="Add a new role: %{item}"
        />
    </Wrapper>
);

const dataProvider = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                author: [1, 2],
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }),
    update: (_resource, params) => Promise.resolve(params),
} as any;

const BookEdit = () => {
    const choices = [
        { id: 1, name: 'Leo Tolstoy' },
        { id: 2, name: 'Victor Hugo' },
        { id: 3, name: 'William Shakespeare' },
        { id: 4, name: 'Charles Baudelaire' },
        { id: 5, name: 'Marcel Proust' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteArrayInput
                    source="author"
                    choices={choices}
                    validate={required()}
                />
            </SimpleForm>
        </Edit>
    );
};

export const InEdit = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEdit} />
        </Admin>
    </TestMemoryRouter>
);

const BookEditCustomText = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Victor Hugo' },
        { id: 3, fullName: 'William Shakespeare' },
        { id: 4, fullName: 'Charles Baudelaire' },
        { id: 5, fullName: 'Marcel Proust' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteArrayInput
                    source="author"
                    optionText="fullName"
                    choices={choices}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomText = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditCustomText} />
        </Admin>
    </TestMemoryRouter>
);

const BookEditCustomTextFunction = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Victor Hugo' },
        { id: 3, fullName: 'William Shakespeare' },
        { id: 4, fullName: 'Charles Baudelaire' },
        { id: 5, fullName: 'Marcel Proust' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteArrayInput
                    source="author"
                    optionText={choice => choice?.fullName}
                    choices={choices}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomTextFunction = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditCustomTextFunction} />
        </Admin>
    </TestMemoryRouter>
);

const CustomOption = () => {
    const record = useRecordContext();
    return (
        <div>
            {record?.fullName}&nbsp;<i>({record?.language})</i>
        </div>
    );
};

const BookEditCustomOptions = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy', language: 'Russian' },
        { id: 2, fullName: 'Victor Hugo', language: 'French' },
        { id: 3, fullName: 'William Shakespeare', language: 'English' },
        { id: 4, fullName: 'Charles Baudelaire', language: 'French' },
        { id: 5, fullName: 'Marcel Proust', language: 'French' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteArrayInput
                    source="author"
                    optionText={<CustomOption />}
                    inputText={record =>
                        `${record.fullName} (${record.language})`
                    }
                    matchSuggestion={(searchText, record) => {
                        const searchTextLower = searchText.toLowerCase();
                        return (
                            record.fullName
                                .toLowerCase()
                                .includes(searchTextLower) ||
                            record.language
                                .toLowerCase()
                                .includes(searchTextLower)
                        );
                    }}
                    choices={choices}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomOptions = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditCustomOptions} />
        </Admin>
    </TestMemoryRouter>
);

const choicesForCreationSupport = [
    { id: 1, name: 'Leo Tolstoy' },
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'William Shakespeare' },
    { id: 4, name: 'Charles Baudelaire' },
    { id: 5, name: 'Marcel Proust' },
];
const BookEditWithCreationSupport = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <AutocompleteArrayInput
                source="author"
                choices={choicesForCreationSupport}
                onCreate={filter => {
                    const newAuthorName = window.prompt(
                        'Enter a new author',
                        filter
                    );

                    if (newAuthorName) {
                        const newAuthor = {
                            id: choicesForCreationSupport.length + 1,
                            name: newAuthorName,
                        };
                        choicesForCreationSupport.push(newAuthor);
                        return newAuthor;
                    }
                }}
            />
        </SimpleForm>
    </Edit>
);

export const CreationSupport = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" edit={BookEditWithCreationSupport} />
        </Admin>
    </TestMemoryRouter>
);

const authors = [
    { id: 1, name: 'Leo Tolstoy', language: 'Russian' },
    { id: 2, name: 'Victor Hugo', language: 'French' },
    { id: 3, name: 'William Shakespeare', language: 'English' },
    { id: 4, name: 'Charles Baudelaire', language: 'French' },
    { id: 5, name: 'Marcel Proust', language: 'French' },
];

const dataProviderWithAuthors = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                author: [1, 2],
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }),
    getMany: (_resource, params) =>
        Promise.resolve({
            data: authors.filter(author => params.ids.includes(author.id)),
        }),
    getList: (_resource, params) =>
        new Promise(resolve => {
            // eslint-disable-next-line eqeqeq
            if (params.filter.q == undefined) {
                setTimeout(
                    () =>
                        resolve({
                            data: authors,
                            total: authors.length,
                        }),
                    500
                );
                return;
            }

            const filteredAuthors = authors.filter(author =>
                author.name
                    .toLowerCase()
                    .includes(params.filter.q.toLowerCase())
            );

            setTimeout(
                () =>
                    resolve({
                        data: filteredAuthors,
                        total: filteredAuthors.length,
                    }),
                500
            );
        }),
    update: (_resource, params) => Promise.resolve(params),
    create: (_resource, params) => {
        const newAuthor = {
            id: authors.length + 1,
            name: params.data.name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

const BookEditWithReference = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <ReferenceArrayInput reference="authors" source="author">
                <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceArrayInput = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
            <Resource name="books" edit={BookEditWithReference} />
        </Admin>
    </TestMemoryRouter>
);

const LanguageChangingAuthorInput = ({ onChange }) => {
    const { setValue } = useFormContext();
    const handleChange = (value, records) => {
        setValue(
            'language',
            records?.map(record => record.language)
        );
        onChange(value, records);
    };
    return (
        <ReferenceArrayInput reference="authors" source="author">
            <AutocompleteArrayInput
                optionText="name"
                onChange={handleChange}
                label="Authors"
            />
        </ReferenceArrayInput>
    );
};

export const InsideReferenceArrayInputOnChange = ({
    onChange = (value, records) => console.log({ value, records }),
}: Pick<AutocompleteArrayInputProps, 'onChange'>) => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
            <Resource
                name="books"
                create={() => (
                    <Create
                        mutationOptions={{
                            onSuccess: data => {
                                console.log(data);
                            },
                        }}
                        redirect={false}
                    >
                        <SimpleForm>
                            <LanguageChangingAuthorInput onChange={onChange} />
                            <ArrayInput source="language" label="Languages">
                                <SimpleFormIterator>
                                    <TextInput source="." label="Language" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </SimpleForm>
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const CreateAuthor = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();

    return (
        <Dialog open onClose={onCancel}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Create Author</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onCancel}
                sx={theme => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent sx={{ p: 0 }}>
                <CreateBase
                    redirect={false}
                    resource="authors"
                    mutationOptions={{
                        onSuccess: onCreate,
                    }}
                >
                    <SimpleForm defaultValues={{ name: filter }}>
                        <TextInput source="name" helperText={false} />
                        <TextInput
                            source="language"
                            helperText={false}
                            autoFocus
                        />
                    </SimpleForm>
                </CreateBase>
            </DialogContent>
        </Dialog>
    );
};

const BookEditWithReferenceAndCreationSupport = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <ReferenceArrayInput reference="authors" source="author">
                <AutocompleteArrayInput create={<CreateAuthor />} />
            </ReferenceArrayInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceArrayInputWithCreationSupport = () => (
    <TestMemoryRouter initialEntries={['/books/1']}>
        <Admin dataProvider={dataProviderWithAuthors}>
            <Resource name="authors" />
            <Resource
                name="books"
                edit={BookEditWithReferenceAndCreationSupport}
            />
        </Admin>
    </TestMemoryRouter>
);
