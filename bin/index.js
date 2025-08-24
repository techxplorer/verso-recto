#!/usr/bin/env node

import { existsSync } from 'node:fs';

import chalk from 'chalk';
import { Command } from "commander";
import prettyMS from "pretty-ms";

import Migrate from "../src/commands/migrate.js";
import PackageUtils from "../src/utils/package-utils.js";

const startTime = process.hrtime.bigint();

/**
 * Main entry point into the application.
 */
async function run() {

  // Setup the program.
  const program = new Command();
  const appPackage = new PackageUtils();
  program
    .name( "verso-recto" )
    .version( appPackage.getVersion() )
    .description( appPackage.getDescription() )
    .showHelpAfterError( "(add --help for additional information)" )
    .addHelpText(
      "after",
      `\nMore info: ${ appPackage.getHomepage() }\nVersion: ${ appPackage.getVersion() }`
    );

  // Add the arguments for the Migrate command to the program.
  program
    .argument( "<verso>", "source directory" )
    .argument( "<recto>", "destination directory" )
    .action( async( verso, recto ) => {

      console.log( `${program.name()} - ${program.version()}\n` );

      if (existsSync( verso ) === false ) {
        console.error( `${ chalk.red( "Error:") } verso path must exist`)
        process.exit(1);
      }

      if( existsSync( recto ) === false ) {
        console.error( `${ chalk.red( "Error:") } recto path must exist` );
        process.exit(1);
      }

      const migrateCommand = new Migrate( verso, recto );
      await migrateCommand.run()
    } )

  // Parse the command line parameters.
  await program.parseAsync( process.argv );

  const endTime = process.hrtime.bigint();
  const totalTime = Number( endTime - startTime ) * 1e-6;

  console.log( "\nElapsed time:", prettyMS( totalTime ) );

}

run();
