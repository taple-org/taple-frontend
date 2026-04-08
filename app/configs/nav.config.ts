import type { NavSection, TemplateLink } from "~/interfaces/link.interfaces";

type IAppFooterLinks = {
  Nav: NavSection[];
  Brand: TemplateLink[];
};

const AppFooterLinks: IAppFooterLinks = {
  Nav: [
    [
      "Features",
      [
        { to: "#", label: "Core features" },
        { to: "#", label: "Pro experience" },
        { to: "#", label: "Integrations" },
      ],
    ],
    [
      "Learn more",
      [
        { to: "#", label: "Blog" },
        { to: "#", label: "Case studies" },
        { to: "#", label: "Customer stories" },
        { to: "#", label: "Best practices" },
      ],
    ],
    [
      "Support",
      [
        { to: "#", label: "Contact" },
        { to: "#", label: "Support" },
        { to: "#", label: "Legal" },
      ],
    ],
  ],
  Brand: [
    { to: "#", icon: { name: "my-icon:instagram", size: 24 } },
    { to: "#", icon: { name: "my-icon:linkedin", size: 24 } },
    { to: "#", icon: { name: "my-icon:x", size: 24 } },
  ],
} as const;

export default {
  footer: AppFooterLinks
}
