export const siteURL = path => new URL(`../${path}`, import.meta.url);
export const docsURL = path => siteURL(`docs/${path || ''}`).href;
export const repoURL = 'https://github.com/nocaljs/nocaljs';
