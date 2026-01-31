import React, { useState } from 'react';
import styles from './profile.module.scss';
import { country, fullName, githubUrl, googleDocId, introduction, linkedinUrl } from "@/app/constants/constants";
import { BiLogoGithub } from "react-icons/bi";
import { IoLogoLinkedin } from "react-icons/io";
import { MdFileDownload } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/app/store/app-store';
import { useAuth } from '@/app/providers/auth-provider';
import LoginModal from '@/app/components/login-modal/login-modal';

const Profile = () => {
  const router = useRouter();
  const { setIsPageLoading, isPageLoading } = useAppStore();
  const { user, getIdToken } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authConfigured, setAuthConfigured] = useState(true);

  const performDownload = async (token: string) => {
    const res = await fetch("/api/resume-download", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to get download link");
    const link = document.createElement("a");
    link.href = data.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openResumePdf = () => {
    const url = `https://docs.google.com/document/d/${googleDocId}/export?format=pdf`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    if (!user) {
      const auth = await import("@/lib/firebase").then((m) => m.getFirebaseAuth());
      setAuthConfigured(!!auth);
      setShowLoginModal(true);
      return;
    }

    try {
      const token = await getIdToken();
      if (!token) throw new Error("Not authenticated");
      await performDownload(token);
    } catch {
      useAppStore.getState().setAlert("error", "Could not download resume. Please try again.");
      useAppStore.getState().setIsAlertOpen(true);
    }
  };

  const handleLoginSuccess = (token: string) => {
    performDownload(token).catch(() => {
      useAppStore.getState().setAlert("error", "Could not download resume. Please try again.");
      useAppStore.getState().setIsAlertOpen(true);
    });
  };

  const navigateToAbout = () => {
    router.push("pages/about");
    setIsPageLoading(true);
  };

  if (isPageLoading) return null;

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        authConfigured={authConfigured}
        onDownloadWithoutSignIn={() => {
          setShowLoginModal(false);
          openResumePdf();
        }}
      />
      <div className={styles.profile}>
      <div className={styles.nameRow}>
        <h1 className={styles.name} onClick={navigateToAbout}
        // data-theme={theme}
        >
          {fullName}
        </h1>
        <div className={styles.socials}>
          <span onClick={handleDownload}><MdFileDownload size={20}/></span>
          <span onClick={() => window.open(linkedinUrl, "_blank")}><IoLogoLinkedin size={30}/></span>
          <span onClick={() => window.open(githubUrl, "_blank")}><BiLogoGithub size={30}/></span>
        </div>
      </div>
      <div className={styles.location}>
        <p>{country}</p>
      </div>
      <p className={styles.intro}>{introduction}</p>
    </div>
    </>
  )
}

export default Profile