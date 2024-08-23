import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Rule = () => {
  const navigate = useNavigate();

  const back = () => {
    navigate("/");
  };

  return (
    <>
      <h1>Rules</h1>
      <div className="rule-container">
        <div>
          <span>1.Objective:</span> Guide the Sheikh through the desert to reach
          Mecca, avoiding fire-breathing dragons and snakes, while collecting
          all the gold coins along the way.
        </div>
        <div>
          <span>2.How to Play:</span> Pay 1 USDC per game using your Coinbase
          wallet. Press the space bar to make the Sheikh jump and fly.
        </div>
        <div>
          <span>3.Scoring:</span> Collect gold coins to increase your score.
          Each playthrough adds to your <b>Cumulative Score</b>, boosting your
          chances to reach the top of the leaderboard.
        </div>
        <div>
          <span>4.Winning:</span> The player with the highest Cumulative Score
          on the leaderboard will be awarded a round trip to Mecca, paid in USDC
          to their wallet. A winner will be announced every Friday on Twitter.
        </div>
        <div>
          <span>5.Multiple Plays:</span> Play as many times as you want. Your
          Cumulative Score will grow with each game, giving you a better shot at
          winning the grand prize.
        </div>
        <div>
          Start your journey on the <b>Road to Mecca</b> and climb the
          leaderboard to win!
        </div>
      </div>
      <button className="connectWallet" onClick={back}>
        Back
      </button>
    </>
  );
};

export default Rule;
