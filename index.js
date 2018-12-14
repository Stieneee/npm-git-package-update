const path = require('path');
const fs = require('fs');
const child = require('child_process');

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

let currentPath = process.cwd();
let packageJSONFileName = path.join(currentPath, 'package.json');

if (fs.statSync(packageJSONFileName).isFile()) {
  let packageJSON = fs.readFileSync(packageJSONFileName);
  let p = JSON.parse(packageJSON);

  let gitDeps = []
  
  if (p.dependencies) gitDeps = gitDeps.concat(walkDep(p.dependencies));
  if (p.devDependencies) gitDeps = gitDeps.concat(walkDep(p.devDependencies));
  if (p.peerDependencies) gitDeps = gitDeps.concat(walkDep(p.peerDependencies));
  if (p.bundledDependencies) gitDeps = gitDeps.concat(walkDep(p.bundledDependencies));
  if (p.optionalDependencies) gitDeps = gitDeps.concat(walkDep(p.optionalDependencies));

  console.log(gitDeps);

  if (gitDeps.length > 0) {
    console.log('npm i ', gitDeps.join(' '));
    child.spawnSync('npm', ['i'].concat(gitDeps), {
      cwd: currentPath,
      stdio: 'inherit',
    });
  }
}

