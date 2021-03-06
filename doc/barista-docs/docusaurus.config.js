module.exports = {
  title: 'Barista',
  tagline: 'open source license and vulnerability management',
  url: 'https://optum.github.io/barista',
  baseUrl: '/barista/',
  favicon: 'img/barista-icon.ico',
  organizationName: 'Optum', // Usually your GitHub org/user name.
  projectName: 'barista', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Barista Docs',
      logo: {
        alt: 'Barista logo',
        src: 'img/barista.png',
      },
      links: [
        {to: 'docs/overview', label: 'Docs', position: 'left'},
        {
          href: 'https://github.com/Optum/barista',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Admin Docs',
          items: [
            {
              label: 'Overview',
              to: 'docs/overview',
            },
            {
              label: 'Admin Setup',
              to: 'docs/setup-admin-tables',
            },
            {
              label: 'Project Setup',
              to: 'docs/setup-scan-project',
            },
          ],
        },
        {
          title: 'Technical Docs',
          items: [
            {
              label: 'Local Dev Environment Setup',
              to: 'docs/local-dev-environment',
            },
            {
              label: 'System Architecture',
              to: 'docs/architecture',
            },
            {
              label: 'License Scanners',
              to: 'docs/license-scanners',
            },
            {
              label: 'License Implementation',
              to: 'docs/licenses',
            },
            {
              label: 'How to Develop a Web Feature',
              to: 'docs/how-to-develop-a-feature',
            },
            {
              label: 'Building and Running Barista Using Docker',
              to: 'docs/barista-on-docker',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/Optum/barista/issues',
            },
            {
              label: 'Contributions to Barista',
              to: 'docs/contributions',
            },
            {
              label: 'Code of Conduct',
              to: 'docs/code-of-conduct',
            },
            {
              label: 'Individual Contributor License Agreement',
              to: 'docs/icla',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Optum, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
