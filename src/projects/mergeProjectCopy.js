import { pickProjectCopy } from '../i18n/messages/projects.js'
import { getProjectMeta } from './registry.js'

/**
 * Registry facts plus localized copy. Registry fields win when a copy key
 * would otherwise overwrite them. Used by the catalog and Project Detail.
 */
export function mergeProjectCopy(id, language) {
  const base = getProjectMeta(id) || {}
  const copy = pickProjectCopy(id, language)
  const captions = copy.evidenceCaptions || {}
  return {
    ...base,
    ...copy,
    id: base.id,
    title: base.title,
    status: base.status,
    tier: base.tier,
    categories: base.categories,
    tags: base.tags,
    stack: base.stack,
    homeStack: base.homeStack,
    stages: base.stages,
    visual: base.visual,
    caseStudies: base.caseStudies,
    githubUrl: base.githubUrl,
    githubCtaKey: base.githubCtaKey,
    projectUrl: base.projectUrl,
    privateRepo: base.privateRepo,
    hasLiveDemo: base.hasLiveDemo,
    hasDemoVideo: base.hasDemoVideo,
    resultsSectionKey: base.resultsSectionKey,
    evidenceVisuals: (base.evidenceVisuals || []).map((item) => ({
      ...item,
      caption: captions[item.id] || item.caption,
      alt: captions[item.id] || item.alt || item.caption,
    })),
  }
}
