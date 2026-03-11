type IconMetadata = {
    size?: number
}
export type TemplateLink = {
    to: string;
    label?: string;
    external?: boolean;
    target?: "_self" | "_blank";
    icon?: {
        name: string;
    } & IconMetadata;
    ariaLabel?: string;
    disabled?: boolean;
}
export type NavSection = [string, TemplateLink[]];
