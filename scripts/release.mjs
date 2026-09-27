// Publishes the package with the npm CLI, whose trusted publishing (OIDC) flow
// the registry accepts, then tags the release; changesets/action reads the
// "New tag:" lines to push tags and open the GitHub release.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const dir = 'packages/skylcn-ui';
const { name, version } = JSON.parse(readFileSync(`${dir}/package.json`, 'utf8'));

let published = '';
try {
  published = execFileSync('npm', ['view', `${name}@${version}`, 'version'], {
    encoding: 'utf8',
  }).trim();
} catch {
  // The package or version is not on the registry yet
}

if (published === version) {
  console.log(`${name}@${version} is already on npm`);
} else {
  execFileSync('npm', ['publish', '--access', 'public', '--provenance'], {
    cwd: dir,
    stdio: 'inherit',
  });
  execFileSync('pnpm', ['changeset', 'tag'], { stdio: 'inherit' });
}
