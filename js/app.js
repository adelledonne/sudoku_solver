var BOARD_SEL = "#sudoku-board";
var DIFF_SEL = "#generator-diffs";
var PUZZLE_CONTROLS_SEL = "#puzzle-controls";
var SOLVER_CONTROLS_SEL = "#solver-controls";

var boards = {
    "easy": null,
    "medium": null,
    "hard": null,
    "super": null
};

var build_board = function(){
    for(var r = 0; r < 9; ++r){
        var $row = $("<tr/>", {});
        for(var c = 0; c < 9; ++c){
            var $square = $("<td/>", {});
            if(c % 3 == 2 && c != 8){
                $square.addClass("border-right");
            }
            $square.append(
                $("<input/>", {
                    id: "row" + r + "-col" + c,
                    class: "square",
                    maxlength: "9",
                    type: "text"
                })
            );
            $row.append($square);
        }
        if(r % 3 == 2 && r != 8){
            $row.addClass("border-bottom");
        }
        $(BOARD_SEL).append($row);
    }
};

var init_board = function(){

    $(BOARD_SEL + " input.square").change(function(){
        var $square = $(this);
        var nr_digits = $square.val().length;
        var font_size = "25px";
        if(nr_digits === 2){
            font_size = "18px";
        } else if(nr_digits === 3){
            font_size = "15px";
        } else if(nr_digits === 4){
            font_size = "12px";
        } else if(nr_digits === 5){
            font_size = "10px";
        } else if(nr_digits === 6){
            font_size = "8px";
        } else if(nr_digits === 7){
            font_size = "6px";
        } else if(nr_digits === 8){
            font_size = "4px";
        } else if(nr_digits >= 9){
            font_size = "2px";
        }
        $(this).css("font-size", font_size);
    });
    $(BOARD_SEL + " input.square").keyup(function(){
        $(this).change();
    });

};

var init_diffs = function(){
    $(DIFF_SEL + " a").click(function(e){
        e.preventDefault();
        var $t = $(this);
        var d_name = $t.attr("id");
        show_puzzle(d_name);
        $t.tab('show');
    });
};

var init_controls = function(){
    $(PUZZLE_CONTROLS_SEL + " #refresh").click(function(e){
        e.preventDefault();
        var diff_type = get_diff();
            show_puzzle(diff_type, true);
    });
    
    $(SOLVER_CONTROLS_SEL + " #solve").click(function(e){
        e.preventDefault();
        solve_puzzle(get_diff());
    });
    
    $(SOLVER_CONTROLS_SEL + " #get-hints").click(function(e){
        e.preventDefault();
        get_hints(get_diff());
    });
};

var solve_puzzle = function(puzzle){
    if(typeof boards[puzzle] !== "undefined"){
        display_puzzle(boards[puzzle], true);
        
        var error = false;
        try{
            var solved_board = 
                sudoku.solve(sudoku.board_grid_to_string(boards[puzzle]));
        } catch(e) {
            error = true;
        }
        
        if(solved_board && !error){
            display_puzzle(sudoku.board_string_to_grid(solved_board), true);
        } 
    }
};

var get_hints = function(puzzle){

    if(typeof boards[puzzle] !== "undefined"){
        display_puzzle(boards[puzzle], true);
        
        var error = false;
        try{
            var hints = 
                sudoku.get_hints(
                    sudoku.board_grid_to_string(boards[puzzle])
                );
        } catch(e) {
            error = true;
        }
        
        if(hints && !error){
            display_puzzle(hints, true);
        } 
    }
}

var show_puzzle = function(puzzle, refresh){
 
    refresh = refresh || false;
    
    if(typeof boards[puzzle] === "undefined"){
        puzzle = "easy";
    }
    
    if(boards[puzzle] === null || refresh){ 
        
            boards[puzzle] = 
                sudoku.board_string_to_grid(sudoku.generate(puzzle));
        
    }
    
    display_puzzle(boards[puzzle]);
}

var display_puzzle = function(board, highlight){
    for(var r = 0; r < 9; ++r){
        for(var c = 0; c < 9; ++c){
            var $square = $(BOARD_SEL + " input#row" + r + "-col" + c);
            $square.removeClass("red-text");
            $square.attr("disabled", "disabled");
            if(board[r][c] != sudoku.BLANK_CHAR){
                var board_val = board[r][c];
                var square_val = $square.val();
                if(highlight && board_val != square_val){
                    $square.addClass("red-text");
                }
                $square.val(board_val);
            } else {
                $square.val('');
            }
            $square.change();
        }
    }
};

var get_diff = function(){
    return $(DIFF_SEL + " li.active a").attr("id");
};

var click_diff = function(diff_type){
    $(DIFF_SEL + " #" + diff_type).click();
};

$(function(){
    build_board();
    init_board();
    init_diffs();
    init_controls();

    $("[rel='tooltip']").tooltip();
    
    click_diff("easy");
    
    $("#app-wrap").removeClass("hidden");
    $("#loading").addClass("hidden");
});