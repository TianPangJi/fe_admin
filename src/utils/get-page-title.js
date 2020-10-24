import defaultSettings from '@/settings'

const title = defaultSettings.title || 'DRF Admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
