import { Command } from 'commander';
import { mkdir, writeFile } from 'mz/fs';
import { ncp } from 'ncp';

export interface FileEntry {
    name: string;
    body: string;
};

/**
 * Creates all directories
 *
 * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
 * @param {string} targetDir Where to place the directories
 * @param {...string[]} directories
 * @returns {Promise<void>}
 */
export async function createDirectories(targetDir: string, ...directories: string[]): Promise<void> {
    await mkdir(targetDir);
    for (const directory of directories) {
        await mkdir(`${targetDir}/${directory}`);
    }
}

export async function createFiles(targetDir: string, ...files: FileEntry[]): Promise<void> {
    for (const file of files) {
        await writeFile(`${targetDir}/${file.name}`, file.body);
    }
}

function copyFilesAndDirectories(sourceDir: string, targetDir: string): Promise<void> {
    return new Promise(resolve => ncp(sourceDir, targetDir, () => resolve()));
}

const program = new Command();

program.version('0.1.0');
program.executeSubCommand = () => false;
program
    .command('new <name>', 'Creates a new Lollipop project')
    .action(async (_, other) => {
        console.log(`creating project ${process.cwd()}/${other}`);
        console.log(`dirname is ${__dirname}`);
        await copyFilesAndDirectories(`${__dirname}/../skel/full`, `${other}`);
    });
program
    .command('some')
    .action(() => console.log('It\'s some'));
program.parse(process.argv);

