const fs = require('fs');
const yargs = require('yargs');

const environment = yargs.argv.environment;
const isProduction = yargs.argv.environment === "prod";
const targetPath = environment ? `./src/environments/environment.${environment}.ts` : './src/environments/environment.ts';

const envFile = `export const environment = {
  production: ${isProduction},
  personnelApi: "${process.env.PersonnelApi}"
}`

fs.writeFileSync(targetPath, envFile);
console.log(`New ${targetPath} file: ${envFile}`);
