class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalMoves = 0;
    this.isProcessing = false;
    
    // Card symbols (emojis)
    // this.symbols = ['🐙', '📚', '🐱', '🐼', '🦝', '🐝', '🕷️', '💎'];
    this.symbols = ['🌹', '🌻', '🌷', '🌸', '🍉', '🍊', '🍍', '🍓'];
    
    this.init();
  }

  init() {
    this.createCards();
    this.renderCards();
    this.bindEvents();
    this.updateStats();
  }

  createCards() {
    // Create pairs of cards
    this.cards = [];
    this.symbols.forEach((symbol, index) => {
      // Add two cards for each symbol
      this.cards.push({ id: index * 2, symbol, matched: false });
      this.cards.push({ id: index * 2 + 1, symbol, matched: false });
    });
    
    // Shuffle the cards
    this.shuffleCards();
  }

  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  renderCards() {
    const cardGrid = document.getElementById('card-grid');
    cardGrid.innerHTML = '';

    this.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'card';
      cardElement.dataset.index = index;
      
      cardElement.innerHTML = `
        <div class="card-inner">
          <div class="card-front">?</div>
          <div class="card-back">${card.symbol}</div>
        </div>
      `;
      
      cardElement.addEventListener('click', () => this.flipCard(index));
      cardGrid.appendChild(cardElement);
    });
  }

  flipCard(index) {
    if (this.isProcessing) return;
    
    const card = this.cards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    
    // Don't flip if already flipped or matched
    if (cardElement.classList.contains('flipped') || card.matched) return;
    
    // Don't allow more than 2 cards to be flipped
    if (this.flippedCards.length >= 2) return;

    // Flip the card
    cardElement.classList.add('flipped');
    this.flippedCards.push({ index, element: cardElement });

    // Check for match when 2 cards are flipped
    if (this.flippedCards.length === 2) {
      this.totalMoves++;
      this.updateStats();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isProcessing = true;
    
    const [first, second] = this.flippedCards;
    const firstCard = this.cards[first.index];
    const secondCard = this.cards[second.index];

    if (firstCard.symbol === secondCard.symbol) {
      // Match found
      setTimeout(() => {
        first.element.classList.add('matched');
        second.element.classList.add('matched');
        firstCard.matched = true;
        secondCard.matched = true;
        
        this.matchedPairs++;
        this.flippedCards = [];
        this.isProcessing = false;
        this.updateStats();
        
        // Check if game is won
        if (this.matchedPairs === this.symbols.length) {
          setTimeout(() => this.showWinModal(), 500);
        }
      }, 600);
    } else {
      // No match - flip cards back
      setTimeout(() => {
        first.element.classList.remove('flipped');
        second.element.classList.remove('flipped');
        this.flippedCards = [];
        this.isProcessing = false;
      }, 1000);
    }
  }

  updateStats() {
    document.getElementById('matched-pairs').textContent = this.matchedPairs;
    document.getElementById('total-moves').textContent = this.totalMoves;
  }

  showWinModal() {
    document.getElementById('final-moves').textContent = this.totalMoves;
    document.getElementById('win-modal').classList.remove('hidden');
  }

  hideWinModal() {
    document.getElementById('win-modal').classList.add('hidden');
  }

  resetGame() {
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalMoves = 0;
    this.isProcessing = false;
    this.hideWinModal();
    this.createCards();
    this.renderCards();
    this.updateStats();
  }

  bindEvents() {
    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetGame();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      this.resetGame();
    });

    // Close modal when clicking outside
    document.getElementById('win-modal').addEventListener('click', (e) => {
      if (e.target.id === 'win-modal') {
        this.hideWinModal();
      }
    });
  }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new MemoryGame();
});