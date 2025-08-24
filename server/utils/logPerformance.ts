import consola from 'consola';
import chalk from 'chalk';

type TargetScope = 'task' | 'api' | 'database';

const thresholds = {
  task: { ok: 16, good: 50, bad: 100 },
  api: { ok: 100, good: 300, bad: 1000 },
  database: { ok: 50, good: 200, bad: 500 },
};

export function logPerformance(scope: TargetScope, start: number) {
  const end = performance.now();
  const duration = end - start;

  if (scope === 'task') {
    if (duration <= thresholds.task.ok) {
      consola.success(
        ` [TASK] (OK) Completed in `,
        chalk.hex('#60a5fa')(`${duration.toFixed(2)}ms`),
      );
    } else if (duration <= thresholds.task.good) {
      consola.success(
        ` [TASK] (GOOD) Completed in `,
        chalk.hex('#4ade80')(`${duration.toFixed(2)}ms`),
      );
    } else if (duration <= thresholds.task.bad) {
      consola.success(
        ` [TASK] (VERY BAD) Completed in `,
        chalk.hex('#fb923c')(`${duration.toFixed(2)}ms`),
      );
    } else {
      consola.success(
        ` [TASK] (FAIL) Completed in `,
        chalk.hex('#f87171')(`${duration.toFixed(2)}ms`),
      );
    }
  } else if (scope === 'api') {
    if (duration <= thresholds.api.ok) {
      consola.success(
        ` [API] (OK) Responded in `,
        chalk.hex('#60a5fa')(`${duration.toFixed(2)}ms`),
      );
    } else if (duration <= thresholds.api.good) {
      consola.success(
        ` [API] (GOOD) Responded in `,
        chalk.hex('#4ade80')(`${duration.toFixed(2)}ms`),
      );
    } else if (duration <= thresholds.api.bad) {
      consola.success(
        ` [API] (VERY BAD) Responded in `,
        chalk.hex('#fb923c')(`${duration.toFixed(2)}ms`),
      );
    } else {
      consola.success(
        ` [API] (FAIL) Responded in `,
        chalk.hex('#f87171')(`${duration.toFixed(2)}ms`),
      );
    }
  } else {
    if (duration <= thresholds.database.ok) {
      consola.success(
        ` [DATABASE] (OK) Query executed in `,
        chalk.hex('#60a5fa')(`${duration.toFixed(2)}ms`),
      );
    } else if (duration <= thresholds.database.good) {
      consola.success(
        ` [DATABASE] (GOOD) Query executed in `,
        chalk.hex('#4ade80')(`${duration.toFixed(2)}ms`),
      );
    } else if (duration <= thresholds.database.bad) {
      consola.success(
        ` [DATABASE] (VERY BAD) Query executed in `,
        chalk.hex('#fb923c')(`${duration.toFixed(2)}ms`),
      );
    } else {
      consola.success(
        ` [DATABASE] (FAIL) Query executed in `,
        chalk.hex('#f87171')(`${duration.toFixed(2)}ms`),
      );
    }
  }
}
