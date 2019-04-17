//variables
var lvl1w = 9; //largeur grille
var lvl1h = 9; // hauteur grille
var lvl1m = 10; //nb de mine

var mineField;
var opened;



startGame();
function startGame()
{
  mineField = new Array();
  opened = 0;
  
  //creation du tableau
  for(var i=0; i<lvl1h; i++)
  {
    mineField[i] = new Array();
    for(var j=0; j<lvl1w; j++)
    {
      mineField[i].push(0);
    }
  }
  
  //placement des mines
  var placedMines = 0;
  var Row,Col;
  while(placedMines < lvl1m)
  {
    Row = Math.floor(Math.random() * lvl1h);
    Col = Math.floor(Math.random() * lvl1w);
    if(mineField[Row][Col] == 0)
    {
      mineField[Row][Col] = 9;
      placedMines++;
    }
  }
  
  //placement des chiffres
  for(var i=0; i < lvl1h; i++)
  {
    for(var j=0; j<lvl1w; j++)
    {
      if(mineField[i][j] == 9)
      {
        for(var ii=-1; ii<=1; ii++) //check des cases adjacentes
        {
          for(var jj=-1; jj<=1; jj++)
          {
            if(ii!=0 || jj!=0)
            {
              if(caseValue(i+ii,j+jj) != 9 && caseValue(i+ii,j+jj) != -1)
              {
                mineField[i+ii][j+jj]++;
              }
            }
          }
        }
      }
    }
  }
  
  //integration dans la page html
  for(var i=0; i<lvl1h; i++)
  {
    for(var j=0; j<lvl1w; j++)
    {
      var case = $("#container").append("<span id='"+i+""+j+"' data-row='"+i+"' data-col='"+j+"' class='box first'></span>");
    }
  }
  
  $("#container span.box").on('contextmenu',function(e)
  {
    e.preventDefault();
    if($(this).hasClass("checked"))
    {
      $(this).removeClass("checked");
    } else {
      $(this).addClass("checked");
    }
  });
  
  $("#container span.box").click(function()
  {
    if(!$(this).hasClass('checked'))
    {
    var case = $(this);
    var clickedRow = case.data('row');
    var clickedCol = case.data('col');
    var clickedVal = mineField[clickedRow][clickedCol];
    
    if(clickedVal == 0)
    {
      padding(clickedRow,clickedCol);
    }
    
    if(clickedVal > 0 && clickedVal < 9)
    {
      case.removeClass('first');
      case.html(clickedVal);
      opened++;
    }
    
    if(clickedVal == 9)
    {
      case.removeClass('first');
      case.append("<span class='bomb'></span>");
      $("#container").after('<a href="#" id="again">BOUM! Nouvelle partie ?</a>');
      $("#container .box").off('click');
      $("a#again").on('click',function(e)
      {
        e.preventDefault();
        $("#container span.box").remove();
        $("#again").remove();
        startGame();
      });
    }
    
    checkopened();
    }
  });
  
}



function padding(row,col)
{
  var case = $("#container span#"+row+""+col);
  if(case.hasClass('first'))
  {
    case.removeClass('first');
    if(case.hasClass("checked"))
    {
        case.removeClass("checked");
      }
    if(mineField[row][col] > 0){
      case.html(mineField[row][col]);
      opened++;
    } else {
      case.addClass("opened");
      opened++;
    }
  
    if(mineField[row][col] == 0){
      for(var ii=-1; ii<=1; ii++){
        for(var jj=-1; jj<=1; jj++){
          if(ii!=0 || jj!=0){
            if(caseValue(row+ii,col+jj) != 9){
              if(caseValue(row+ii,col+jj) != -1){
                padding(row+ii,col+jj);
              }
            }
          }
        }
      }
    }
  }
}

function checkopened()
{
  console.log(opened);
  if(opened >= 71)
  {
    $("#container").after('<a href="#" id="again">BRAVO! Nouvelle partie ?</a>');
    $("#container .box").off('click');
    $("a#again").on('click',function(e)
    {
      e.preventDefault();
      $("#container span.box").remove();
      $("#again").remove();
      startGame();
    });
  }
}

function caseValue(row,col)
{
  if(mineField[row] == undefined || mineField[row][col] == undefined)
  {
    return -1;
  } else {
    return mineField[row][col];
  }
}