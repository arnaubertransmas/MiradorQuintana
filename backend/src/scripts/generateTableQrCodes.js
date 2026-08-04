const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

async function main() {
  const [, , baseUrlRaw, numTablesRaw, outputDirRaw] = process.argv;

  if (!baseUrlRaw || !numTablesRaw) {
    console.error('Usage: node src/scripts/generateTableQrCodes.js <baseUrl> <numTables> [outputDir]');
    console.error('Example: node src/scripts/generateTableQrCodes.js https://miradorquintana.com 20');
    process.exitCode = 1;
    return;
  }

  const baseUrl = baseUrlRaw.replace(/\/+$/, '');
  const numTables = Number(numTablesRaw);

  if (!Number.isInteger(numTables) || numTables < 1) {
    console.error('numTables must be a positive integer');
    process.exitCode = 1;
    return;
  }

  const outputDir = outputDirRaw || path.join(__dirname, '..', '..', 'qr-codes');
  fs.mkdirSync(outputDir, { recursive: true });

  for (let table = 1; table <= numTables; table += 1) {
    const url = `${baseUrl}/?taula=${table}`;
    const outputPath = path.join(outputDir, `taula-${table}.png`);
    await QRCode.toFile(outputPath, url, { width: 600, margin: 2 });
    console.log(`Taula ${table}: ${url} -> ${outputPath}`);
  }

  console.log(`\nDone. ${numTables} QR codes written to ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
