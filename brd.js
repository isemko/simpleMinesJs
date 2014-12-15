var Mine = (function() {
  var brd = [],
    checks = [],
    numMines = 12,
    listener,
    brdRow;

  return {
    setChecks: function(brdRowLength) {
      checks = [1, -1, -(brdRowLength - 1), brdRowLength - 1, brdRowLength, -(brdRowLength), brdRowLength + 1, -(brdRowLength + 1)];
    },
    setBoard: function(size) {
      var rnd = 0;
      var ranIndexes = [];
      var exclude = [];
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
    applyEmpty: function(spn, indx) {
      spn.className += ' is-empty';
      spn.removeEventListener('click', listener);
      spn.innerHTML = this.findNeighborBombs(indx);
    },
    findBomb: function(clickedCellIndex) {
      var spns = document.querySelectorAll('span');

      if (brd[clickedCellIndex] === 2) {
        spns[clickedCellIndex].className += ' is-mine';
      } else {
        spns[clickedCellIndex].className += ' is-empty';
        var rowLength = Math.sqrt(brd.length);
        for (var j = 0; j < checks.length; j++) {
          if (typeof(brd[clickedCellIndex + checks[j]]) !== undefined) {
            if (brd[clickedCellIndex + checks[j]] === 1) {
              //if right row
              if ((clickedCellIndex + 1) % rowLength === 0) {
                if (checks[j] !== (brdRow + 1) && checks[j] !== -(brdRow - 1) && checks[j] !== 1) {
                  this.applyEmpty(spns[clickedCellIndex + checks[j]], clickedCellIndex + checks[j]);
                }
              } else if ((clickedCellIndex) % rowLength === 0 || clickedCellIndex === 0) {
                //if left row
                if (checks[j] !== -(brdRow + 1) && checks[j] !== (brdRow - 1) && checks[j] !== -1) {
                  this.applyEmpty(spns[clickedCellIndex + checks[j]], clickedCellIndex + checks[j]);
                }
              } else {
                this.applyEmpty(spns[clickedCellIndex + checks[j]], clickedCellIndex + checks[j]);
              }
            } else {
              if (spns[clickedCellIndex + checks[j]]) {}
            }
          }
        }
      }
    },
    outputBoard: function(id, size, minesCount) {

      brdRow = size ? size : 8;
      numMines = minesCount ? minesCount : numMines;

      if (size < 4) {
         console.log('size is too small');
         return;
       }
       

      this.setBoard(size * size);
      this.setChecks(brdRow);
      var boardEl = document.querySelector('#' + id),
        boardHTML = '',
        this_ = this;

      for (var k = 0, kl = brd.length; k < kl; k++) {
        boardHTML += '<span class="' + k + '">&nbsp;&nbsp;&nbsp;</span>';
        if ((k + 1) % brdRow === 0) {
          boardHTML += '<br/>';
        }
      }

      boardEl.innerHTML = boardHTML;

      listener = function() {
        this_.findBomb(parseInt(this.className));
      };

      [].forEach.call(document.querySelectorAll('span'), function(item) {
        item.addEventListener('click', listener);
      });
    }
  }
}());