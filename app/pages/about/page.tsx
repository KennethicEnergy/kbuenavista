"use client"
import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import { useAppStore } from '@/app/store/app-store';
import { IoIosArrowRoundBack } from 'react-icons/io';
import AboutSlideshow from '@/app/components/about-slideshow/about-slideshow';
import { aboutSlideshowImages } from '@/app/constants/constants';

const Page = () => {
  const { setIsPageLoading, setAlert, setIsAlertOpen } = useAppStore();

  useEffect(() => {
    setIsPageLoading(false);
    setAlert("warning", "This feature is currently on development.");
    setIsAlertOpen(true);
  }, [setIsPageLoading, setAlert, setIsAlertOpen]);

  return (
    <div className={styles.about}>
      <Link href="/" onClick={() => setIsPageLoading(true)}>
        <h1>
          <IoIosArrowRoundBack />
          About
        </h1>
      </Link>

      <div className={styles.avatar}>
        <AboutSlideshow images={aboutSlideshowImages} />
      </div>
      <p>
        I’m a Frontend Developer with nearly a decade of experience building production-ready web applications that are fast, maintainable, and actually pleasant to use. I specialize in turning complex requirements into clean, scalable UI architectures while keeping performance, accessibility, and developer experience in mind.
      </p>

      <p>
        Over the years, I’ve worked across different industries and team sizes, collaborating closely with designers, backend engineers, and stakeholders to ship features that solve real problems. I care deeply about code quality, thoughtful file structure, and long-term maintainability — not just making things “work,” but making them easy to evolve.
      </p>

      <p>
        My main stack revolves around JavaScript / TypeScript, React, Next.js, and modern frontend tooling. I’m comfortable working with both CSR and SSR setups, designing reusable component systems, and optimizing applications through code splitting, state management, and performance best practices.
      </p>

      <p>
        Beyond coding, I enjoy mentoring, reviewing pull requests, and improving team workflows. I believe great frontend work lives at the intersection of solid engineering, good UX, and clear communication.
      </p>

      <p>
        When I’m not coding, I’m usually learning something new, refining my personal projects, or exploring better ways to build clean, scalable web experiences.
      </p>
    </div>
  )
}

export default Page;