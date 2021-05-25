const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const globby = require('globby');
const fse = require('fs-extra');

const tasks = new Listr([
    {
        title: 'Set up lambda functions',
        task: () => {
            return new Listr([
                {
                    title: 'Gather lambda directories',
                    task: (context) =>
                        globby(['*-lambda'], {
                            cwd: path.join(__dirname, '..'),
                            onlyDirectories: true,
                            absolute: true,
                        }).then((lambdas) => {
                            context.lambdas = lambdas;
                        }),
                },
                {
                    title: 'Install dependencies',
                    task: (context) => {
                        context.lambdas.forEach((cwd) => {
                            execa('npm', ['install'], { cwd });
                        });
                    },
                },
            ]);
        },
    },
    {
        title: 'Copy .env file',
        task: () =>
            fse.copySync(path.join(__dirname, '../example.env'), path.join(__dirname, '../.env')),
        skip: () => fse.pathExistsSync(path.join(__dirname, '../.env')),
    },
    {
        title: 'Deploy to localStack',
        task: async () => {
            await execa('npx', ['cdklocal', 'bootstrap'], { cwd: path.join(__dirname, '..') });
            await execa('npx', ['cdklocal', 'deploy', '--require-approval=never'], {
                cwd: path.join(__dirname, '..'),
            });
        },
    },
]);

tasks.run().catch((error) => {
    console.error(error);
});
