import { Command } from 'commander';
import { ncp } from 'ncp';
import { existsSync, readdirSync } from 'mz/fs';

function copyFilesAndDirectories(sourceDir: string, targetDir: string): Promise<void> {
    return new Promise(resolve => ncp(sourceDir, targetDir, () => resolve()));
}

const program = new Command();

program.version('0.2.0', '-v --version');

program.option('-h, --help', 'Displays help', () => {
    program.help();
});

program
    .command('new <name> [template=full]')
    .description('Creates a new Lollipop project')
    .action(async (projectName, template = 'full') => {
        const templateDir = `${__dirname}/../skel`;
        const templatePath = `${templateDir}/${template}`;
        if (!existsSync(templatePath)) {
            const validTemplates: string = readdirSync(templateDir).filter(name => name !== '.gitkeep').join(' ');
            console.error(`No template with name ${template} exists. Valid templates are : ${validTemplates}`);
            process.exit(0);
        }
        console.log(`creating project ${process.cwd()}/${projectName} with template ${template}`);
        if (existsSync(`${process.cwd()}/${projectName}`)) {
            console.error('A folder with the project name already exists, aborting');
            process.exit(1);
        }
        await copyFilesAndDirectories(templatePath, projectName);
    });

// error on unknown commands
program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});
program.parse(process.argv);

