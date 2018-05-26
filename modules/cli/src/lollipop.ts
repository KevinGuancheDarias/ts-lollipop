import { Command } from 'commander';
import { ncp } from 'ncp';

function copyFilesAndDirectories(sourceDir: string, targetDir: string): Promise<void> {
    return new Promise(resolve => ncp(sourceDir, targetDir, () => resolve()));
}

const program = new Command();

program.version('0.1.1');
program.executeSubCommand = () => false;
program
    .command('new <name>', 'Creates a new Lollipop project')
    .action(async (_, other) => {
        console.log(`creating project ${process.cwd()}/${other}`);
        console.log(`dirname is ${__dirname}`);
        await copyFilesAndDirectories(`${__dirname}/../skel/full`, `${other}`);
    });
program.parse(process.argv);

