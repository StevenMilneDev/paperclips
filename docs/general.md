# Universal Paperclips
## General
This page contains general information about the way Paperclips works.

### Game Loop
Paperclips uses two game loops to drive it's logic, both of them using `setInterval` with different intervals. There is the main game loop which runs every 10ms, the bulk of the logic in the game happens in this loop. The other loop is the slow loop which runs every 100ms and calculates things like wire price fluctuation, paperclip sales and revenue and is also used to auto-save the game.

The game seems to consume a fair amount of battery power while running both in the web and on Android, this is likely due to the fact that the bulk of the games work is done in the fast loop. Some things could be moved out of the fast loop and into the slow loop without compromising speed of progress in the game. The project management subsystem is one such component which has already been moved to the slow loop due its DOM manipulation making it costly to repeatedly call.

The main loop also updates the DOM with all of the current values. This is a lot of elements whose `innerHTML` is being changed. We could get a decent performance improvement if the DOM manipulation was done in animation frames.
