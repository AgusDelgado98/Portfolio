import { pickProjectCopy } from '../i18n/messages/projects.js'
import { getProjectMeta, NODE_PROFILES } from './registry.js'

/**
 * Merges a project's registry metadata (routing-critical, language-neutral
 * facts) with its localized copy (i18n/messages/projects.js) — the single
 * place that combines both, used by ProjectCard, ProjectsAtlas and
 * ProjectDetail alike (Phase 4 — Projects Experience). Extracted from the
 * old Projects.jsx dialog's local `mergeProjectCopy`, unchanged in
 * behavior, just shared instead of duplicated three times.
 *
 * Plain JS (no JSX) — importable from anywhere without dragging in icons.
 */
export function mergeProjectCopy(id, language) {
  const base = getProjectMeta(id) || {}
  const copy = pickProjectCopy(id, language)
  const profile = NODE_PROFILES[id] || {}
  const captions = copy.evidenceCaptions || {}
  return {
    ...base,
    ...copy,
    status: profile.status || 'Active',
    weight: profile.weight,
    annotation: copy.annotation || profile.annotation,
    signals: copy.signals || base.signals || [],
    evidenceVisuals: (base.evidenceVisuals || []).map((item) => ({
      ...item,
      caption: captions[item.id] || item.caption,
      alt: captions[item.id] || item.alt || item.caption,
    })),
  }
}
