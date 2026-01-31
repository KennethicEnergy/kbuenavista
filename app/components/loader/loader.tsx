"use client"

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { RiLoader2Line } from 'react-icons/ri';
import styles from './loader.module.scss'
import { useAppStore } from '@/app/store/app-store';

const Loader = () => {
  const pathname = usePathname();
  const { isPageLoading, setIsPageLoading } = useAppStore();

  useEffect(() => {
    setIsPageLoading(false);
  }, [pathname, setIsPageLoading]);

  useEffect(() => {
    const container = document.getElementById("layout-container");
    if (container) {
      container.style.padding = isPageLoading ? "unset" : "";
    }
  }, [isPageLoading])

  return (
    <>{isPageLoading && <div className={styles.loader}>
      <RiLoader2Line size={30}/>
    </div>}</>
  )
}

export default Loader;