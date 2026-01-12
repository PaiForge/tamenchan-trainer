import styles from "./BookLayout.module.css";

interface HeaderProps {
  readonly onMenuClick?: () => void;
}

/**
 * モバイル用ヘッダーコンポーネント
 *
 * ハンバーガーメニューとタイトルを表示
 */
export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className={styles.mobileHeader}>
      <button
        className={styles.menuButton}
        aria-label="Menu"
        onClick={onMenuClick}
      >
        ☰
      </button>
      <span className={styles.title}>Tamenchan</span>
      <div style={{ width: "40px" }} /> {/* Spacer for centering */}
    </header>
  );
}
