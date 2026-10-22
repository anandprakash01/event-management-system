process.on("uncaughtException", err => {
  console.log(`[FATAL] [PROCESS] uncaughtException, Shutting down...`);
  console.log(err.stack);
  process.exit(1);
});
