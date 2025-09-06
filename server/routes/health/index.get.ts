import { defineEventHandler } from 'h3';

export default defineEventHandler(() => {
  function getUptime() {
    const seconds = process.uptime();
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  }

  function getMemoryUsage() {
    const memoryUsage = process.memoryUsage();

    function format(bytes: number) {
      return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
    }

    return {
      rss: format(memoryUsage.rss),
      heapTotal: format(memoryUsage.heapTotal),
      heapUsed: format(memoryUsage.heapUsed),
      external: format(memoryUsage.external),
      arrayBuffers: format(memoryUsage.arrayBuffers),
    };
  }

  return {
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: getUptime(),
      memory: getMemoryUsage(),
    },
  };
});
