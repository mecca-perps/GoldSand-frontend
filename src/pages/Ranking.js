import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { shortenAddress } from "../utils";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Ranking = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  const back = () => {
    navigate("/");
  };

  useEffect(() => {
    const init = async () => {
      const res = await axios.get(`${SERVER_URL}/getRanking`);
      if (res.data.message === "success") {
        setPlayers(res.data.players);
      }
    };
    init();
  }, []);

  return (
    <>
      <h1>Leaderboard</h1>
      <div className="leaderboard">
        <div className="table-header">
          <span>Ranking</span>
          <span>Address</span>
          <span>Score</span>
        </div>
        {players.length === 0 ? (
          <>No players yet</>
        ) : (
          players.map((player, index) => {
            return (
              <div key={index} className="table-header">
                <span>{index + 1}</span>
                <span>{shortenAddress(player.walletAddress)}</span>
                <span>{player.score}</span>
              </div>
            );
          })
        )}
      </div>
      <button className="connectWallet" onClick={back}>
        Back
      </button>
    </>
  );
};

export default Ranking;
