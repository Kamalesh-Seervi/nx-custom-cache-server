import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson,
  joinPathFragments,
  readProjectConfiguration,
  names,
} from '@nx/devkit';
import * as path from 'path';
import { InitGeneratorSchema } from './schema';

interface NormalizedSchema extends InitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: InitGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `apps/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    template: '',
  };
  
  const templatePath = options.provider === 'gcp' 
    ? path.join(__dirname, 'files-gcp') 
    : path.join(__dirname, 'files-aws');
    
  generateFiles(tree, templatePath, options.projectRoot, templateOptions);
}

function updatePackageJson(tree: Tree, options: NormalizedSchema) {
  if (options.skipPackageJson) {
    return;
  }

  const dependencies: Record<string, string> = {
    express: '^4.18.2',
    ...(options.includeMetrics && { 'prom-client': '^15.1.3' }),
    pino: '^8.15.0',
    'pino-pretty': '^10.2.0',
  };

  const devDependencies: Record<string, string> = {
    nodemon: '^3.0.2',
    '@types/express': '^4.17.17',
    '@types/node': '^20.5.0',
    typescript: '^5.2.0',
  };

  if (options.provider === 'gcp') {
    dependencies['@google-cloud/storage'] = '^7.5.0';
  } else {
    dependencies['@aws-sdk/client-s3'] = '^3.400.0';
    dependencies['@aws-sdk/s3-request-presigner'] = '^3.400.0';
  }

  updateJson(tree, 'package.json', (json) => {
    json.dependencies = { ...json.dependencies, ...dependencies };
    json.devDependencies = { ...json.devDependencies, ...devDependencies };
    return json;
  });
}

export default async function (tree: Tree, options: InitGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      serve: {
        executor: '@nx/node:node',
        options: {
          buildTarget: `${normalizedOptions.projectName}:build`,
        },
      },
      build: {
        executor: '@nx/webpack:webpack',
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          main: `${normalizedOptions.projectRoot}/src/main.ts`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.app.json`,
          target: 'node',
        },
      },
      dev: {
        executor: '@nx/node:node',
        options: {
          buildTarget: `${normalizedOptions.projectName}:build`,
          watch: true,
        },
      },
      ...(options.includeDocker && {
        'docker-build': {
          executor: '@nx/docker:build',
          options: {
            context: normalizedOptions.projectRoot,
            file: `${normalizedOptions.projectRoot}/Dockerfile`,
          },
        },
      }),
    },
    tags: normalizedOptions.parsedTags,
  });

  addFiles(tree, normalizedOptions);
  updatePackageJson(tree, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
}

export const initGenerator = async (tree: Tree, schema: InitGeneratorSchema) => {
  return await exports.default(tree, schema);
};
