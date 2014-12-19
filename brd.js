var Mine = (function() {
  'use strict';
  var brd = [],
    checks = [],
    excludeIndxs = [],
    flaggedSquares = [],
    numMines = 12,
    listener,
    brdRow,
    flagged = false,
    foundCount = 0;

  return {
    setChecks: function(brdRowLength) {
      checks = [1, -1, -(brdRowLength - 1), brdRowLength - 1, brdRowLength, -(brdRowLength), brdRowLength + 1, -(brdRowLength + 1)];
    },
    setBoard: function(size) {
      var rnd = 0;
      var ranIndexes = [];
      for (var x = 0; x < numMines; x++) {
        rnd = Math.floor((Math.random() * (size - 1)) + 1);
        if (ranIndexes.indexOf(rnd) === -1) {
          ranIndexes.push(rnd);
        } else {
          numMines++;
        }
      }
      for (var i = 0; i < size; i++) {
        if (ranIndexes.indexOf(i) !== -1) {
          brd.push(2);
        } else {
          brd.push(1);
        }
      }
      return brd;
    },
    findNeighborBombs: function(indx) {
      var count = 0;

      for (var x = 0; x < checks.length; x++) {
        if (typeof(brd[indx + checks[x]]) !== undefined) {
          if (brd[indx + checks[x]] === 2) {
            if ((indx + 1) % brdRow === 0) {
              if (checks[x] !== (brdRow + 1) && checks[x] !== -(brdRow - 1) && checks[x] !== 1) {
                count++;
              }
            } else if ((indx) % brdRow === 0 || indx === 0) {
              if (checks[x] !== -(brdRow + 1) && checks[x] !== (brdRow - 1) && checks[x] !== -1) {
                count++;
              }
            } else {
              count++;
            }
          }
        }
      }

      return count;

    },
    findPos: function() {},
    applyEmpty: function(spn, indx) {
      spn.className += ' is-empty';

      var checkedCount = this.findNeighborBombs(indx);

      if (checkedCount > 0 && flaggedSquares.indexOf(indx) !== -1) {
        spn.innerHTML = checkedCount;
        spn.removeEventListener('click', listener);
      }
      excludeIndxs.push(indx);
      if (checkedCount === 0) {
        for (var f = 0; f < checks.length; f++) {
          if (brd[indx + checks[f]]) {

            if ((indx + 1) % brdRow === 0) {
              if (checks[f] !== (brdRow + 1) && checks[f] !== -(brdRow - 1) && checks[f] !== 1) {
                this.findBomb(indx + checks[f]);
              }
            } else if ((indx) % brdRow === 0 || indx === 0 && excludeIndxs.indexOf(indx + checks[f]) === -1) {
              //if left row
              if (checks[f] !== -(brdRow + 1) && checks[f] !== (brdRow - 1) && checks[f] !== -1 && excludeIndxs.indexOf(indx + checks[f]) === -1) {
                this.findBomb(indx + checks[f]);
              }
            } else {
              if (excludeIndxs.indexOf(indx + checks[f]) === -1) {
                this.findBomb(indx + checks[f]);
              }

            }
          }
        }
      }
    },
    findBomb: function(clickedCellIndex) {
      var spns = document.querySelectorAll('span');
      var notFlag = true;
      if (flagged) {
        if (spns[clickedCellIndex].className.indexOf('is-flagged') === -1) {
          spns[clickedCellIndex].className += ' is-flagged';
          flaggedSquares.push(clickedCellIndex);
          if (brd[clickedCellIndex] === 2) {
            foundCount++;
          }
        } else {

          spns[clickedCellIndex].className = spns[clickedCellIndex].className.split('is-flagged').join();
          flaggedSquares.splice(flaggedSquares.indexOf(clickedCellIndex), 1);

          if (brd[clickedCellIndex] === 2) {
            foundCount--;
          }
        }
        if (foundCount === numMines) {
          console.log('solved');
        }
      } else
      if (brd[clickedCellIndex] === 2) {
        spns[clickedCellIndex].className += ' is-mine';
        spns[clickedCellIndex].removeEventListener(listener);
      } else {
        spns[clickedCellIndex].className += ' is-empty';
        for (var j = 0; j < checks.length; j++) {
          if (typeof(brd[clickedCellIndex + checks[j]]) !== undefined) {

            notFlag = flaggedSquares.indexOf(clickedCellIndex) === -1;
            var cnt = this.findNeighborBombs(clickedCellIndex);
            if (cnt > 0 && notFlag) {
              spns[clickedCellIndex].innerHTML = cnt;
            }

            if (brd[clickedCellIndex + checks[j]] === 1) {
              //if right row
              if ((clickedCellIndex + 1) % brdRow === 0) {
                if (checks[j] !== (brdRow + 1) && checks[j] !== -(brdRow - 1) && checks[j] !== 1 && excludeIndxs.indexOf(clickedCellIndex + checks[j]) === -1) {
                  this.applyEmpty(spns[clickedCellIndex + checks[j]], clickedCellIndex + checks[j]);
                }
              } else if ((clickedCellIndex) % brdRow === 0 || clickedCellIndex === 0 && excludeIndxs.indexOf(clickedCellIndex + checks[j]) === -1) {
                //if left row
                if (checks[j] !== -(brdRow + 1) && checks[j] !== (brdRow - 1) && checks[j] !== -1 && excludeIndxs.indexOf(clickedCellIndex + checks[j]) === -1) {
                  this.applyEmpty(spns[clickedCellIndex + checks[j]], clickedCellIndex + checks[j]);
                }
              } else {
                if (excludeIndxs.indexOf(clickedCellIndex + checks[j]) === -1) {
                  this.applyEmpty(spns[clickedCellIndex + checks[j]], clickedCellIndex + checks[j]);
                }

              }
            } else {
              if (spns[clickedCellIndex + checks[j]]) {}
            }
          }
        }
      }
    },
    outPutBoard: function(id, flagId, size, minesCount) {

      brd = [];
      brdRow = size ? size : 8;
      numMines = minesCount ? minesCount : numMines;

      if (size < 4) {
        console.log('size is too small');
        return;
      } else if (minesCount >= size * size) {
        console.log('too many mines');
        return;
      }

      this.setBoard(size * size);
      this.setChecks(brdRow);

      var boardEl = document.querySelector('#' + id),
        boardHTML = '<button class="flagged">flag</button>',
        this_ = this;

      for (var k = 0, kl = brd.length; k < kl; k++) {
        boardHTML += '<span class="' + k + '">&nbsp;&nbsp;&nbsp;</span>';
        if ((k + 1) % brdRow === 0) {
          boardHTML += '<br/>';
        }
      }

      boardEl.innerHTML = boardHTML;

      document.querySelector('.flagged').addEventListener('click', function() {
        flagged = !flagged;
      });

      listener = function() {
        this_.findBomb(parseInt(this.className));
      };

      [].forEach.call(document.querySelectorAll('span'), function(item) {
        item.addEventListener('click', listener);
      });
    }
  };
}());