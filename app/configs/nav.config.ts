import type { NavSection, TemplateLink } from "~/interfaces/link.interfaces";

// Translation keys for footer - actual translations in i18n/locales/*.json
type IAppFooterLinks = {
  Nav: NavSection[];
  Brand: TemplateLink[];
};

const AppFooterLinks: IAppFooterLinks = {
  Nav: [
    [
      "footer.features",
      [
        { to: "#", label: "footer.coreFeatures" },
        { to: "#", label: "footer.proExperience" },
        { to: "#", label: "footer.integrations" },
      ],
    ],
    [
      "footer.learnMore",
      [
        { to: "#", label: "footer.blog" },
        { to: "#", label: "footer.caseStudies" },
        { to: "#", label: "footer.customerStories" },
        { to: "#", label: "footer.bestPractices" },
      ],
    ],
    [
      "footer.support",
      [
        { to: "#", label: "footer.contact" },
        { to: "#", label: "footer.support" },
        { to: "#", label: "footer.legal" },
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
  footer: AppFooterLinks,
};
