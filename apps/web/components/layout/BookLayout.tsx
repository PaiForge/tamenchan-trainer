import React from "react";
import styles from "./BookLayout.module.css";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface BookLayoutProps {
  readonly children: React.ReactNode;
}

/**
 * ブックレイアウトコンポーネント
 *
 * Zenn Bookのような、サイドバーと少し狭いメインコンテンツエリアを持つレイアウト
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function BookLayout(props: BookLayoutProps) {
  const { children } = props;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div className={styles.mobileDrawer}>
            <Sidebar
              className={styles.mobileSidebarInner}
              onLinkClick={closeMobileMenu}
            />
          </div>
        </>
      )}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Header onMenuClick={toggleMobileMenu} />
        <main className={styles.mainContent}>
          <div className={styles.contentContainer}>{children}</div>
        </main>
      </div>
    </div>
  );
}
