"use client";

import React from 'react'
import styles from './card.module.scss';
import Image from 'next/image';
import { rowIcons } from "@/app/constants/tech-icons";
import { useAppStore } from '@/app/store/app-store';

type CardProps = {
  projectGif: string;
  projectTechStack: Array<string> | null;
}

const Card = ({ projectGif, projectTechStack }: CardProps) => {
  const { setAlert } = useAppStore();

  const handleClick = () => {
    setAlert("info", "Full-screen gallery is coming soon.");
  }

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
      <Image src={projectGif} alt="Project preview" fill quality={80} priority sizes="(max-width: 768px) 100vw, 600px" />
      <div className={styles.madeWith}>
        {projectTechStack && projectTechStack.length > 0 && <span>Made with:</span>}
        <div className={styles.technologies}>
          {projectTechStack?.map((tech, index) => (
            <span key={index}>{rowIcons.find(icon => icon.key === tech)} {tech}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Card
