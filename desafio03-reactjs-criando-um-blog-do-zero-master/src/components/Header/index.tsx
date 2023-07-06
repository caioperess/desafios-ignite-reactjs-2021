import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/Logo.svg';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={styles.container}>
      <Link href="/" legacyBehavior>
        <Image src={logo} alt="logo" />
      </Link>
    </div>
  );
}
