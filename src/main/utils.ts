import { Issue } from 'doubter/core';

export function pushIssue(issues: Issue[] | null, result: Issue): Issue[] {
  if (issues === null) {
    return [result];
  }
  issues.push(result);
  return issues;
}
