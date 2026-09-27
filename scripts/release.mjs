// Stages the package on npm through trusted publishing (OIDC): the trusted
// publisher allows staging only, so a maintainer approves each release on
// npmjs.com (Staged Packages) with 2FA before it goes live. Then it tags the
// release; changesets/action reads the "New tag:" lines to push the tag and
// open the GitHub release.
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

// A staged version is not on npm until it is approved, so its tag, pushed when
// it was staged, is what keeps the next run from staging it again
const tag = `${name}@${version}`;
const tagged = execFileSync('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`], {
  encoding: 'utf8',
}).trim();

if (published === version) {
  console.log(`${tag} is already on npm`);
} else if (tagged) {
  console.log(`${tag} is staged; approve it on npmjs.com under Staged Packages`);
} else {
  execFileSync('npm', ['stage', 'publish', '--access', 'public', '--provenance'], {
    cwd: dir,
    stdio: 'inherit',
  });
  execFileSync('pnpm', ['changeset', 'tag'], { stdio: 'inherit' });
  // Pushed here rather than left to changesets/action, so the next run sees the
  // version is staged even before anyone approves it
  execFileSync('git', ['push', 'origin', `refs/tags/${tag}`], { stdio: 'inherit' });
}
