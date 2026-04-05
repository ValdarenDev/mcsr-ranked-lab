import React, { useState } from "react";
import Layout from "../components/Layout";
// import { comparePlayers } from "../logic/compareLogic";

const ComparePage = () => {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [results, setResults] = useState(null);

  const handleCompare = async () => {
    // const data = await comparePlayers(p1, p2);
    setResults(data);
  };

  return (
    <Layout>
      <h2>Search Player</h2>

      <input className="mc-input" value={p1} onChange={e => setP1(e.target.value)} />
      <input className="mc-input" value={p2} onChange={e => setP2(e.target.value)} />
      <button className="mc-button" onClick={handleCompare}>Compare</button>

      {results && <pre>{JSON.stringify(results, null, 2)}</pre>}
    </Layout>
  );
};

export default ComparePage;