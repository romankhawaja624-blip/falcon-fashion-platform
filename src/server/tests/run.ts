import { runBackendTests } from './backendTests';

export async function executeBackendTests() {
  console.log('--- Running FALCON Backend Automated Test Suite ---');
  const summary = await runBackendTests();
  summary.results.forEach((r) => console.log(r));
  console.log(`\nTest Results: ${summary.passed}/${summary.total} Passed (${summary.failed} Failed)`);
  return summary;
}

executeBackendTests();
