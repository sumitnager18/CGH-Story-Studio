// Project Validation Utility
// Requirement Phase 57

import { Project } from '../types';
import { validateProject, ProjectValidationResult } from '../domain/validationEngine';

export { validateProject };
export type { ProjectValidationResult };

export function logProjectValidation(project: Project): boolean {
  const result = validateProject(project);

  if (result.errors.length > 0) {
    console.error(`[CGH Project Validation] ${result.errors.length} error(s) found in project "${project.name}":`, result.errors);
  }
  if (result.warnings.length > 0) {
    console.warn(`[CGH Project Validation] ${result.warnings.length} warning(s) found in project "${project.name}":`, result.warnings);
  }

  return result.valid;
}
