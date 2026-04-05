import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
// import { getProfileData } from "../logic/profileLogic";
// import { buildWinLossChart, buildCompletionChart } from "../logic/chartLogic";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  const winLossRef = useRef(null);
  const completionRef = useRef(null);

  useEffect(() => {
    async function load() {
      const data = await getProfileData();
      setProfile(data);
    }
    load();
  }, []);

  useEffect(() => {
    if (!profile) return;

    buildWinLossChart(winLossRef.current, profile.runs);
    buildCompletionChart(completionRef.current, profile.runs);
  }, [profile]);

  return (
    <Layout>
      {/* JSX UI here */}
      <canvas ref={winLossRef} />
      <canvas ref={completionRef} />
    </Layout>
  );
};

export default ProfilePage;