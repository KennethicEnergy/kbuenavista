"use client"
import React, { useEffect, useRef } from 'react'
import Link from 'next/link';
import Card from '../../components/card/card';
import styles from './page.module.scss';
import { IoIosArrowRoundBack } from "react-icons/io";
import { usePathname } from 'next/navigation';
import { timelineData } from "@/app/constants/data";
import { useAppStore } from '@/app/store/app-store';

const Page = () => {
  const pathname = usePathname();
  const { setIsPageLoading } = useAppStore();
  const navigatingRef = useRef(false);
  const projectData = timelineData.find((project) => `/${project.projectUrl}` === pathname);

  const handleBackClick = (e: React.MouseEvent) => {
    if (navigatingRef.current) {
      e.preventDefault();
      return;
    }
    navigatingRef.current = true;
    setIsPageLoading(true);
  };

  useEffect(() => {
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  return (
    <div className={styles.project}>
      <h1>
        <Link href="/" onClick={handleBackClick}>
          <IoIosArrowRoundBack />
          {projectData?.projectName}
        </Link>
      </h1>
      <Card
        projectGif={projectData?.projectGif ?? '/images/fallback-img.jpg'}
        projectTechStack={projectData?.projectTechStack ?? []}/>
      <p>{projectData?.projectDescription ?? 'No project description found.'}</p>
    </div>
  )
}

export default Page