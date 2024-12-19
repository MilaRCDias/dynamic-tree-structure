import { Theme, useTheme } from '../../hooks/useTheme';
import { LuSunMedium as LightIcon } from 'react-icons/lu';
import { FaMoon as DarkIcon } from 'react-icons/fa';
import styles from './Header.module.scss';

const Header = () => {
  const [theme, onToggleTheme] = useTheme();

  return (
    <header className={styles.header}>
      <span>Dynamic Tree</span>
      <button onClick={onToggleTheme} className={styles['theme-toggle']}>
        {theme === Theme.Light ? <DarkIcon /> : <LightIcon />}
      </button>
    </header>
  );
};

export default Header;
