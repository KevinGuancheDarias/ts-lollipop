import * as recursiveReadDir from 'recursive-readdir';
import * as path from 'path';
import { exists } from 'mz/fs';
import { lstatSync } from 'fs';
import { BadInputLollipopError } from '../errors/bad-input-lollipop.error';

export class MetadataUtil {

    /**
     * finds all Typescript files in directories
     *
     * @author Kevin Guanche Darias <kevin@kevinguanchedarias.com>
     * @static
     * @param {string[]} directories Input directories
     * @throws {BadInputLollipopError} If one of the passed directories doesn't exists
     * @returns {Promise<string[]>} an array containing all the files
     * @memberof MetadataUtil
     */
    public static async findAllTypescriptSourceFiles(directories: string[]): Promise<string[]> {
        const currentWorkingDir = process.cwd();
        let files: string[] = [];
        await Promise.all(
            directories.map(async currentDirectory => {
                if (!(await exists(currentDirectory)) || !lstatSync(currentDirectory).isDirectory()) {
                    throw new BadInputLollipopError(`Directory ${currentDirectory} doesn't exists, or it's not a directory`);
                }
                files = files.concat(await recursiveReadDir(currentDirectory));
            })
        );
        return files.filter(current => current.endsWith('.ts')).map(current => `${currentWorkingDir}${path.sep}${current}`);
    }
    private constructor() {
        // It's an util class
    }
}
