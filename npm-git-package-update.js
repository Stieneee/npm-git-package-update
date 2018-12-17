#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const child = require('child_process');
const program = require('commander');
const klawSync = require('klaw-sync');

program
  .version('0.2.1')
  .option('-r, --recursive', 'recursively update package.json excluding node_modules and hidden folders')
  .parse(process.argv);

function isGitUrl(url) {
  if (url.includes('git:')) return true;
  if (url.includes('git+ssh:')) return true;
  if (url.includes('git+http:')) return true;
  if (url.includes('git+https:')) return true;
  if (url.includes('git+file:')) return true;
  if (url.includes('github:')) return true;
  if (url.includes('gitlab:')) return true;
  return false;
}

function walkDep(deps) {
  let gitDeps = []
  for (const dep in deps) {
    if (deps.hasOwnProperty(dep)) {
      let url = deps[dep];
      if (isGitUrl(url)) gitDeps.push(dep);
    }
  }
  return gitDeps;
}

function attemptUpdate(currentPath, recursive) {
  let packageJSONFileName = path.join(currentPath, 'package.json');
  if (fs.existsSync(packageJSONFileName)) {
    let packageJSON = fs.readFileSync(packageJSONFileName);
    let p = JSON.parse(packageJSON);
  
    let gitDeps = []
    
    if (p.dependencies) gitDeps = gitDeps.concat(walkDep(p.dependencies));
    if (p.devDependencies) gitDeps = gitDeps.concat(walkDep(p.devDependencies));
    if (p.peerDependencies) gitDeps = gitDeps.concat(walkDep(p.peerDependencies));
    if (p.optionalDependencies) gitDeps = gitDeps.concat(walkDep(p.optionalDependencies));
  
    if (recursive) console.log('\nAttempting to update git packages in', currentPath);
    if (gitDeps.length > 0) {
      console.log('npm i', gitDeps.join(' '));
      child.spawnSync('npm', ['i'].concat(gitDeps), {
        cwd: currentPath,
        stdio: 'inherit',
      });
    } else {
      console.log('No git url based packages to update.')
    }
  } else if (!recursive) {
    console.error('No package.json');
  }
}

attemptUpdate(process.cwd(), false);

if (program.recursive) {
  console.log('\nRecursive updates enabled. Searching sub folders.');
  let dirs = klawSync(process.cwd(), {
    nofile: true,
    filter: (item) => (!item.path.includes('node_modules') && !item.path.includes('/.')),
  })

  for (const dir of dirs) {
    attemptUpdate(dir.path, true);
  }

  console.log('\nDone npm-git-package-update.');
}


