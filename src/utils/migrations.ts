// Project Schema Migration System
// Requirement Phase 56

import { Project } from '../types';
import { CURRENT_SCHEMA_VERSION, migrateProject } from '../domain/projectEngine';

export { CURRENT_SCHEMA_VERSION };

export function ensureProjectVersion(project: any): Project {
  // If version matches current prototype, check structural integrity
  if (project && project.schemaVersion === CURRENT_SCHEMA_VERSION) {
    return project as Project;
  }

  // Otherwise run migration
  const migrated = migrateProject(project);
  (migrated as any).schemaVersion = CURRENT_SCHEMA_VERSION;
  return migrated;
}
