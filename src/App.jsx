import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [coinsPerClick, setCoinsPerClick] = useState(1);
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [upgrades, setUpgrades] = useState([
    { emoji: "👆", description: "Увеличение монет за клик", level: 0, cost: 10 },
    { emoji: "✨", description: "Множитель монет за клик", level: 0, cost: 100 },
    { emoji: "⏱️", description: "Автоклик, медленный", level: 0, cost: 50 },
    { emoji: "🚀", description: "Автоклик, средний", level: 0, cost: 200 },
    { emoji: "🌟", description: "Автоклик, быстрый", level: 0, cost: 500 },
    { emoji: "💩", description: "Порадовать Владика", level: 0, cost: 10000 }
  ]);
  const [autoCoins, setAutoCoins] = useState([0, 0, 0]); // Пассивный доход от каждого автоклика

  useEffect(() => {
    const interval = setInterval(() => {
      const autoGain = autoCoins.reduce((sum, ac) => sum + ac, 0);
      setScore(score => score + autoGain);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoCoins]);

  const handleClick = () => {
    setScore(prevScore => prevScore + coinsPerClick * clickMultiplier);
  };

  const handleToggleSize = () => {
    setExpanded(!expanded);
  };

  const triggerEmojiAttack = () => {
    const totalDuration = 10000; // Общая длительность анимации
    const emojiFrequency = 10; // Частота появления эмодзи
    const target = document.querySelector('.App-logo'); // Цель атаки
  
    const targetRect = target.getBoundingClientRect(); // Получаем координаты цели
  
    // Ускорение вращения лого
    target.style.animation = "spin 1s linear infinite";
  
    const interval = setInterval(() => {
      const emoji = document.createElement("div");
      emoji.textContent = "💩"; // Используйте любой другой эмодзи по желанию
      emoji.style.position = "absolute";
      emoji.style.left = `${Math.random() * window.innerWidth}px`;
      emoji.style.top = `${Math.random() * window.innerHeight}px`;
      emoji.style.transition = "all 0.5s"; // Ускорение движения
      document.body.appendChild(emoji);
  
      setTimeout(() => {
        emoji.style.left = `${targetRect.left + targetRect.width / 2}px`; // Центр цели по горизонтали
        emoji.style.top = `${targetRect.top + targetRect.height / 2}px`; // Центр цели по вертикали
      }, 10);
  
      setTimeout(() => {
        document.body.removeChild(emoji);
      }, 500); // Быстрое удаление эмодзи
    }, emojiFrequency);
  
    // Остановка создания эмодзи и возврат к нормальному вращению лого
    setTimeout(() => {
      clearInterval(interval);
      target.style.animation = "spin 20s linear infinite"; // Возвращаем начальную скорость вращения
    }, totalDuration);
  };
  
  

  const handleUpgrade = (index) => {
    const newUpgrades = [...upgrades];
    const newAutoCoins = [...autoCoins];
    if (newUpgrades[index].level < 20 && score >= newUpgrades[index].cost) {
      setScore(prevScore => prevScore - newUpgrades[index].cost);
      newUpgrades[index].level += 1;
      newUpgrades[index].cost = Math.ceil(newUpgrades[index].cost * (index === 1 ? 1.2 : 1.1));
      setUpgrades(newUpgrades);

      if (index === 0) {
        setCoinsPerClick(prev => prev + 1);
      } else if (index === 1) {
        setClickMultiplier(prev => prev * 1.05);
      } else if (index > 1) {
        newAutoCoins[index - 2] = newAutoCoins[index - 2] + 1; // Увеличиваем пассивный доход
        setAutoCoins(newAutoCoins);
      } else if (index === 5) { 
        triggerEmojiAttack();
      } 
    }
  };

  return (
    <div className={`App ${expanded ? 'expanded' : ''}`}>
      <p>Монеты: {score}</p>
      <img src="vldf.png" className="App-logo" alt="logo" onClick={triggerEmojiAttack} />
      {expanded && (
        <div className="slider">
          {upgrades.map((upgrade, i) => (
            <div className="slide" key={i} onClick={() => handleUpgrade(i)}>
              <div className="emoji">{upgrade.emoji}</div>
              <div className="description">{upgrade.description}</div>
              <div className="level">Уровень: {upgrade.level}</div>
              <div className="cost">Цена: {upgrade.cost}</div>
            </div>
          ))}
        </div>
      )}
      <button onClick={handleToggleSize} className="toggle-size">
        {expanded ? '↓' : '↑'}
      </button>
    </div>
  );
}

export default App;
