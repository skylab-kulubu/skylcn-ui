import { ErrorScenePage } from '@skylab-kulubu/skylcn-ui';

// The playground's own 404: the club's scene, a random drawing on each visit
export default function NotFound() {
  return <ErrorScenePage kind="notFound" href="/" />;
}
