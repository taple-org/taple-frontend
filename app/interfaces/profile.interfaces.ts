export type ProfileListLinkItem = {
    type: 'link',
    to: string,
};
export type ProfileListNestedItem = {
    type: 'nested',
    items: ProfileListItem[]
};
export type ProfileListActionItem = {
    type: 'action',
    action: () => void
};

export type ProfileListItem = {
    title: string
    icon?: string,
    description?: string,
    full?: boolean,
} & (ProfileListLinkItem | ProfileListNestedItem | ProfileListActionItem);

export type ProfileListConfig = ProfileListItem[];