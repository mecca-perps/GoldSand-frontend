import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWallet } from "../app/mainSlice";
import { Toaster } from "react-hot-toast";
import { shortenAddress } from "../utils";
import toast from "react-hot-toast";

import "../App.css";

const GoldSand = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const scoreRef = useRef(0);
  const [isPaid, setIsPaid] = useState(false);

  const walletAddress = useSelector((state) => state.main.walletAddress);

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;
  const GROUND_HEIGHT = 50;
  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 60;

  let playerY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;
  let isFlying = false;
  let gameStarted = false;
  let obstacles = [];
  let coins = [];
  let clouds = [];
  let dragons = [];
  let ethCollected = 0;

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    initializeClouds();
    drawGame(ctx);

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (!gameStarted) {
          gameStarted = true;
          updateGame(ctx);
        }
        isFlying = true;
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        isFlying = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const initializeClouds = () => {
    for (let i = 0; i < 3; i++) {
      clouds.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * (GAME_HEIGHT / 2),
      });
    }
  };

  const drawGame = (ctx) => {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    drawSun(ctx);

    clouds.forEach((cloud) => drawCloud(ctx, cloud.x, cloud.y));

    drawPyramid(ctx, 0, GAME_HEIGHT - GROUND_HEIGHT);
    drawPyramid(ctx, 500, GAME_HEIGHT - GROUND_HEIGHT);

    ctx.fillStyle = "tan";
    ctx.fillRect(0, GAME_HEIGHT - GROUND_HEIGHT, GAME_WIDTH, GROUND_HEIGHT);

    drawSheikh(ctx, 50, playerY);

    obstacles.forEach((obs) =>
      drawSnake(ctx, obs.x, GAME_HEIGHT - GROUND_HEIGHT - 10)
    );
    coins.forEach((coin) => drawCoin(ctx, coin.x, coin.y));
    dragons.forEach((dragon) => drawDragon(ctx, dragon.x, dragon.y));

    if (!gameStarted) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Press Space to Start", GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
  };

  const drawSheikh = (ctx, x, y) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y + 20, PLAYER_WIDTH, PLAYER_HEIGHT - 20);
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(x + 5, y, 30, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y - 5, PLAYER_WIDTH, 10);
    ctx.fillRect(x, y + 5, 5, 15);
    ctx.fillRect(x + PLAYER_WIDTH - 5, y + 5, 5, 15);
    ctx.fillStyle = "black";
    ctx.fillRect(x + 15, y + 8, 4, 4);
    ctx.fillRect(x + 25, y + 8, 4, 4);
    ctx.fillRect(x + 18, y + 15, 8, 2);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 20);
    ctx.lineTo(x + 20, y + 30);
    ctx.lineTo(x + 30, y + 20);
    ctx.fill();
  };

  const drawSnake = (ctx, x, y) => {
    ctx.fillStyle = "green";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x + i * 10, y - Math.sin(i * 0.5) * 5, 10, 10);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(x + 2, y - 2, 3, 3);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x - 5, y + 3);
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x - 5, y + 7);
    ctx.stroke();
  };

  const drawCoin = (ctx, x, y) => {
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("$ETH", x, y + 5);
  };

  const drawDragon = (ctx, x, y) => {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 30, y - 15);
    ctx.lineTo(x + 30, y + 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(x + 20, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 30, y - 10);
    ctx.lineTo(x - 20, y);
    ctx.lineTo(x - 30, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(x + 30, y);
    for (let i = 1; i <= 5; i++) {
      ctx.lineTo(x + 30 + i * 10, y + Math.sin(i * 0.5) * 10);
    }
    ctx.stroke();
  };

  const drawSun = (ctx) => {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(750, 50, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(750, 50);
      let angle = (i * Math.PI) / 6;
      ctx.lineTo(750 + Math.cos(angle) * 50, 50 + Math.sin(angle) * 50);
      ctx.stroke();
    }
  };

  const drawCloud = (ctx, x, y) => {
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, 25, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + 25, y - 10, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 25, Math.PI * 1.5, Math.PI * 0.5);
    ctx.arc(x + 25, y + 10, 25, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  };

  const drawPyramid = (ctx, x, y) => {
    ctx.fillStyle = "#D2B48C";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 150, y - 200);
    ctx.lineTo(x + 300, y);
    ctx.closePath();
    ctx.fill();
  };

  const updateGame = (ctx) => {
    if (!gameStarted) return;

    if (isFlying) {
      playerY -= 5;
      if (playerY < 0) playerY = 0;
    } else {
      playerY += 5;
      if (playerY > GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT) {
        playerY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;
      }
    }

    obstacles = updateAndFilterObjects(obstacles, 5);
    coins = updateAndFilterObjects(coins, 5);
    dragons = updateAndFilterObjects(dragons, 7);

    if (Math.random() < 0.02 && obstacles.length < 3) {
      obstacles.push({ x: GAME_WIDTH, y: GAME_HEIGHT - GROUND_HEIGHT - 10 });
    }

    if (Math.random() < 0.01 && coins.length < 2) {
      coins.push({
        x: GAME_WIDTH,
        y: Math.random() * (GAME_HEIGHT - GROUND_HEIGHT - 40) + 20,
      });
    }

    if (Math.random() < 0.005 && dragons.length < 2) {
      dragons.push({
        x: GAME_WIDTH,
        y: Math.random() * (GAME_HEIGHT - GROUND_HEIGHT - 100),
      });
    }

    // Check collisions
    if (checkCollisions()) {
      //   if (ethCollected > 0) {
      //     ethCollected--;
      //     scoreRef.current.textContent = `$ETH: ${ethCollected}`;
      //   } else {
      gameOver(ctx);
      return;
      //   }
    }

    // Collect coins
    coins = coins.filter((coin) => {
      if (
        coin.x >= 50 &&
        coin.x <= 90 &&
        Math.abs(coin.y - (playerY + PLAYER_HEIGHT / 2)) < 40
      ) {
        ethCollected++;
        scoreRef.current.textContent = `$ETH: ${ethCollected}`;
        return false;
      }
      return true;
    });

    drawGame(ctx);
    requestAnimationFrame(() => updateGame(ctx));
  };

  const updateAndFilterObjects = (objects, speed) => {
    return objects.filter((obj) => {
      obj.x -= speed;
      return obj.x > -100;
    });
  };

  const checkCollisions = () => {
    const sheikhRect = {
      x: 50,
      y: playerY,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };

    for (let obs of obstacles) {
      const snakeRect = {
        x: obs.x,
        y: GAME_HEIGHT - GROUND_HEIGHT - 10,
        width: 50,
        height: 10,
      };
      if (isColliding(sheikhRect, snakeRect)) {
        return true;
      }
    }

    for (let dragon of dragons) {
      const dragonRect = {
        x: dragon.x,
        y: dragon.y,
        width: 80,
        height: 30,
      };
      if (isColliding(sheikhRect, dragonRect)) {
        return true;
      }
    }

    return false;
  };

  const isColliding = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const gameOver = (ctx) => {
    gameStarted = false;
    alert(
      `Game Over! You collected ${scoreRef.current.textContent.substring(
        6
      )} $ETH.`
    );
    // toast.success(
    //   `Game Over! You collected ${scoreRef.current.textContent.substring(
    //     6
    //   )} $ETH.`
    // );
    resetGame(ctx);
  };

  const resetGame = (ctx) => {
    playerY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT;
    ethCollected = 0;
    scoreRef.current.textContent = `$ETH: ${ethCollected}`;
    isFlying = false;
    obstacles = [];
    coins = [];
    dragons = [];
    drawGame(ctx);
  };

  const connect = () => {
    dispatch(connectWallet());
  };

  const payFee = () => {
    
  };

  return (
    <div className="main_container">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            padding: "16px 25px",
          },
        }}
        containerStyle={{
          top: 20,
          left: 20,
          bottom: 40,
          right: 30,
        }}
      />
      <h1>GoldSand Rush</h1>
      <div id="instructions">
        Press Space to avoid snakes and dragons. Collect ETH
      </div>
      <div id="gameContainer">
        <canvas
          className="canvas"
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
        ></canvas>
      </div>
      <div id="scoreDisplay" ref={scoreRef}>
        $ETH: 0
      </div>
      {walletAddress === undefined ? (
        <button id="connectWallet" className="connectWallet" onClick={connect}>
          Connect Wallet
        </button>
      ) : (
        <>
          <button className="payFee" onClick={payFee}>
            Pay Fee
          </button>
          <button className="connectWallet">
            {shortenAddress(walletAddress)}
          </button>
        </>
      )}
    </div>
  );
};

export default GoldSand;
