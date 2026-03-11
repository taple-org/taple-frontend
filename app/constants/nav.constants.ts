import type {NavSection, TemplateLink} from "~/interfaces/link";

type IAppFooterLinks = {
    Nav: NavSection[];
    Brand: TemplateLink[];
}

export const AppFooterLinks: IAppFooterLinks = {
    Nav: [
        [
            "Features",
            [
                {to: "#", label: "Core features"},
                {to: "#", label: "Pro experience"},
                {to: "#", label: "Integrations"},
            ],
        ],
        [
            "Learn more",
            [
                {to: "#", label: "Blog"},
                {to: "#", label: "Case studies"},
                {to: "#", label: "Customer stories"},
                {to: "#", label: "Best practices"},
            ],
        ],
        [
            "Support",
            [
                {to: "#", label: "Contact"},
                {to: "#", label: "Support"},
                {to: "#", label: "Legal"},
            ],
        ]
    ],
    Brand: [
        { to: "#", icon: { name: "my:instagram", size: 24 } },
        { to: "#", icon: { name: "my:linkedin", size: 24 } },
        { to: "#", icon: { name: "my:x", size: 24 } },

    ]
} as const;


