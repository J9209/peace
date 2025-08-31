/*
 * main.js 檔案功能
 *
 * 這個檔案是整個網頁的核心運作邏輯，負責處理所有使用者互動和視覺呈現。
 *
 * 主要功能包含：
 * 1. 每日溫柔話語：網頁載入時，隨機顯示一句正向語錄。
 * 2. 心情選擇與流程控制：當使用者點擊心情按鈕時，啟動「療癒行動」流程，並根據選擇的心情載入對應的任務清單。
 * 3. 療癒行動與能量系統：管理任務的顯示與切換，並在使用者完成任務後，增加能量值。
 * 4. 視覺化成長：根據能量值的變化，動態更新 SVG 樹苗的視覺呈現，使其看起來像是在成長。
 * 5. 動畫效果：處理額外的視覺效果，例如當能量達標時觸發彩帶動畫，或讓表情符號在頁面上漂浮。
 *
 * 簡單來說，如果 tasks.js 提供了療癒行動的「內容」，main.js 則負責處理所有「流程與互動」。
 */

let mood = '';
let energy = 0;
let shuffledTasks = [];
let taskIndex = 0;

// 每日溫柔話語庫
const dailyQuotes = [
  { text: "沒關係，今天也有好好努力過了。", emoji: "🌸" },
  { text: "你的存在本身就是一份禮物。", emoji: "🎁" },
  { text: "慢慢來比較快，給自己一些時間。", emoji: "🌱" },
  { text: "每一次呼吸都是重新開始的機會。", emoji: "🌬️" },
  { text: "你比想像中更勇敢，比看起來更堅強。", emoji: "💪" },
  { text: "今天的小小進步也值得被看見。", emoji: "✨" },
  { text: "溫柔對待自己，就像對待最好的朋友。", emoji: "🤗" },
  { text: "每個難過的時刻都會過去的。", emoji: "🌈" },
  { text: "你已經比昨天的自己更好了。", emoji: "🌟" },
  { text: "允許自己慢一點，世界不會因此停止轉動。", emoji: "🌍" },
  { text: "有時候停下來休息，也是一種前進。", emoji: "🛋️" },
  { text: "你的感受都是真實且重要的。", emoji: "💕" },
  { text: "即使是烏雲密佈的天空，也藏著溫暖的陽光。", emoji: "☁️" },
  { text: "今天做得到的就夠了，明天再說明天的事。", emoji: "🌅" },
  { text: "每一個小小的善意都會回到你身邊。", emoji: "🔄" },
  { text: "你值得被愛，包括來自自己的愛。", emoji: "💕" },
  { text: "生活中的小確幸正等著被你發現。", emoji: "🔍" },
  { text: "深呼吸，現在這一刻你是安全的。", emoji: "🫧" },
  { text: "你的步調就是最適合的步調。", emoji: "👣" },
  { text: "今天也要記得對自己微笑喔。", emoji: "😊" },
  { text: "每個人都有自己的花期，慢慢綻放也很美。", emoji: "🌺" },
  { text: "你的努力，天空都看得見。", emoji: "👁️" },
  { text: "給自己一個擁抱，你辛苦了。", emoji: "🫂" },
  { text: "小小的快樂也是快樂，值得珍惜。", emoji: "🍀" },
  { text: "今天的你已經很棒了，真的。", emoji: "🌼" }
];

// 顯示每日溫柔話
function showDailyQuote() {
  const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
  const todayQuote = dailyQuotes[randomIndex];
  
  document.getElementById('daily-quote-text').textContent = todayQuote.text;
  document.getElementById('quote-emoji').textContent = todayQuote.emoji;
}

function setMood(selectedMood) {
  // 將所選心情儲存在全域變數中
  mood = selectedMood;

  // 取得療癒行動區塊的標題元素
  const healingActionTitle = document.getElementById('healing-action-title');
  // 動態設定標題，顯示所選心情
  healingActionTitle.innerText = `你的療癒行動：${mood}`;

  taskIndex = 0;
  shuffledTasks = shuffleArray([...tasks[mood]]);
  document.querySelector('.task-section').style.display = 'block';
  document.querySelector('.feedback-section').style.display = 'block';
  
  updateTree(energy);
  document.getElementById('energy-fill').style.width = energy + '%';
  
  if (energy === 0) {
    document.getElementById('feedback-text').innerText = '開始你的療癒行動，讓小樹苗和你一起成長吧！';
  } else if (energy >= 100) {
    document.getElementById('feedback-text').innerHTML = 
      '<span class="feedback-text-large">🎉 太棒了！你的心情小樹苗已經茁壯成長為一棵美麗的大樹！今天的你閃閃發光！</span>';
  } else {
    document.getElementById('feedback-text').innerText = `繼續加油！目前心情能量是 ${energy}%，小樹苗正在健康成長中～`;
  }
  
  showTask();
}

// 打亂陣列的函式
function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showTask() {
  if(shuffledTasks.length === 0) return;
  
  const taskElement = document.getElementById('task-text');
  taskElement.innerText = shuffledTasks[taskIndex];
  
  // 隨機選擇手寫字樣式
  const styles = ['', 'style-2', 'style-3'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  
  // 清除之前的樣式
  taskElement.className = 'task-text';
  
  // 添加新樣式
  if (randomStyle) {
    taskElement.classList.add(randomStyle);
  }
}

function completeTask() {
  if(!mood) return alert("請先選擇心情喔～");

  if(energy < 100) {
    energy += 20;
    updateTree(energy);
    
    if(energy >= 100){
      energy = 100;
      document.getElementById('feedback-text').innerHTML = 
        '<span class="feedback-text-large">🎉 太棒了！你的心情小樹苗已經茁壯成長為一棵美麗的大樹！今天的你閃閃發光！</span>';
    } else {
      document.getElementById('feedback-text').innerText = `好棒！你完成了一次的療癒，心情能量增加到 ${energy}%，小樹苗也長大了一些囉～`;
    }
    document.getElementById('energy-fill').style.width = energy + '%';
  } else {
    launchConfetti();
  }

  taskIndex++;
  if(taskIndex >= shuffledTasks.length){
    taskIndex = 0;
    shuffledTasks = shuffleArray([...tasks[mood]]);
  }

  showTask();
}

// 樹苗成長動畫
function updateTree(energyLevel) {
  const treeSvg = document.getElementById('tree-svg');
  const treeTrunk = document.getElementById('tree-trunk');
  const treeLeaves = document.getElementById('tree-leaves');
  const treeFlowers = document.getElementById('tree-flowers');
  const treeSparkles = document.getElementById('tree-sparkles');
  
  const growthFactor = energyLevel / 100;
  const scale = 0.5 + (growthFactor * 0.8);
  
  treeSvg.style.transform = `scale(${scale})`;
  
  const trunkHeight = 20 + (growthFactor * 25);
  const trunkY = 110 - trunkHeight;
  treeTrunk.setAttribute('height', trunkHeight);
  treeTrunk.setAttribute('y', trunkY);
  
  const leafColor = energyLevel < 50 ? '#A5D6A7' : energyLevel < 80 ? '#81C784' : '#66BB6A';
  const leafOpacity = 0.6 + (growthFactor * 0.4);
  
  treeLeaves.querySelectorAll('circle').forEach(circle => {
    circle.setAttribute('fill', leafColor);
    circle.setAttribute('opacity', leafOpacity);
  });
  
  if(energyLevel >= 60) {
    treeFlowers.setAttribute('opacity', (energyLevel - 60) / 40);
  } else {
    treeFlowers.setAttribute('opacity', 0);
  }
  
  if(energyLevel >= 100) {
    treeSparkles.setAttribute('opacity', 1);
    treeSparkles.style.animation = 'sparkle 1.5s ease-in-out infinite';
  } else {
    treeSparkles.setAttribute('opacity', 0);
    treeSparkles.style.animation = '';
  }
}

// 彩帶函式
function launchConfetti() {
  const confettiCount = 100;
  for(let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = `hsl(${Math.random()*360}, 100%, 50%)`;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = 0.9;
    confetti.style.borderRadius = '3px';
    confetti.style.zIndex = 9999;
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);

    const speedY = 2 + Math.random() * 4;
    const speedX = (Math.random() - 0.5) * 4;

    let y = -10;
    let x = parseFloat(confetti.style.left);

    function fall() {
      y += speedY;
      x += speedX;
      confetti.style.top = y + 'px';
      confetti.style.left = x + 'px';

      if(y < window.innerHeight) {
        requestAnimationFrame(fall);
      } else {
        confetti.remove();
      }
    }
    fall();
  }
}

// 漂浮表情（桌面版）
const emojis = ['🌵','🌞','☁️','🌢','🌸','🌿','🍀','🌻'];

function createFloatingEmoji() {
  // 檢查是否為移動設備
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return;

  const emoji = document.createElement('div');
  emoji.className = 'floating-emoji';
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.fontSize = (20 + Math.random() * 30) + 'px';
  emoji.style.opacity = 0.6 + Math.random() * 0.4;

  // 簡化的位置設定 - 避開中心區域
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const centerWidth = containerWidth * 0.6; // 中心60%區域
  const sideWidth = (containerWidth - centerWidth) / 2;

  let x = Math.random() < 0.5 
    ? Math.random() * sideWidth  // 左側
    : containerWidth - sideWidth + Math.random() * sideWidth; // 右側
  let y = Math.random() * containerHeight;

  emoji.style.left = x + 'px';
  emoji.style.top = y + 'px';
  document.body.appendChild(emoji);

  let vx = (Math.random() * 0.5 + 0.1) * (Math.random() < 0.5 ? -1 : 1);
  let vy = (Math.random() * 0.5 + 0.1) * (Math.random() < 0.5 ? -1 : 1);

  function animate() {
    x += vx;
    y += vy;

    // 邊界檢測
    if (x < 0 || x > containerWidth - emoji.offsetWidth) vx = -vx;
    if (y < 0 || y > containerHeight - emoji.offsetHeight) vy = -vy;

    // 避開中心區域
    const centerLeft = sideWidth;
    const centerRight = containerWidth - sideWidth;
    
    if (x > centerLeft && x < centerRight) {
      vx = -vx;
      x = x < containerWidth / 2 ? centerLeft : centerRight;
    }

    x = Math.max(0, Math.min(containerWidth - emoji.offsetWidth, x));
    y = Math.max(0, Math.min(containerHeight - emoji.offsetHeight, y));

    emoji.style.left = x + 'px';
    emoji.style.top = y + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// 初始化漂浮表情（僅桌面版）
function initFloatingEmojis() {
  const isMobile = window.innerWidth <= 768;
  if (!isMobile) {
    for(let i = 0; i < 10; i++) createFloatingEmoji();
  }
}

// 視窗調整事件
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    document.querySelectorAll('.floating-emoji').forEach(e => e.remove());
    initFloatingEmojis();
  }, 300);
});

// 頁面載入時初始化
showDailyQuote();
initFloatingEmojis();

document.getElementById('change-quote-btn').addEventListener('click', showDailyQuote);
