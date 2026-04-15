import './style.css';
import { Game } from './core/Game';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (canvas) {
        const game = new Game(canvas);
        game.start();

        // Restart button logic
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }
});
