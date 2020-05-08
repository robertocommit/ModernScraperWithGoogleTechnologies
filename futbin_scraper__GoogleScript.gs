var api_endpoint = 'https://us-central1-testtutorialscrape.cloudfunctions.net/extract_data?url=';
var futbin_base_url = 'https://www.futbin.com/20/player/';

var spreadsheet = SpreadsheetApp.openById('1PXQdNDiQGB6AngkhSkzQuxYvmVY7ohZLCPhRoR59LUI');
var sheet_input = spreadsheet.getSheetByName('Input');
var sheet_output = spreadsheet.getSheetByName('Output');

var d = new Date();
var timestamp_string = Utilities.formatDate(d, "GMT", "MM-dd-yyyy HH:mm:ss");

function main() {
  var input_players = read_input_data();
  for (var i = 0; i < input_players.length; i++) {
    var player_name = input_players[i][0];
    var player_id = input_players[i][1];
    var futbin_url = futbin_base_url + player_id + '/' + player_name;
    var player_data = extract_data(futbin_url);
    var player_data_array = generate_array_from_dict(player_name, player_id, futbin_url, player_data);
    print_data_to_last_row_sheet(sheet_output, player_data_array);
  }
}

function read_input_data() {
 var last_row = sheet_input.getLastRow();
  var players = new Array();
  for (var i = 2; i <= last_row; i++) {
    var temp_player_name = sheet_input.getRange(i, 1).getValue();
    var temp_player_id = sheet_input.getRange(i, 2).getValue();
    players.push([temp_player_name, temp_player_id]);
  }
  return players;
}

function extract_data(futbin_url) {
  var response = UrlFetchApp.fetch(api_endpoint + futbin_url).getContentText();
  return JSON.parse(response);
}

function generate_array_from_dict(player_name, player_id, futbin_url, player_data) {
  var array_values = new Array();
  for (var console in player_data) {
    for (var item in player_data[console]) {
      array_values.push([
        timestamp_string,
        player_name,
        player_id,
        futbin_url,
        console,
        player_data[console][item][0],
        player_data[console][item][1]]);
    }
  }
  return array_values;
}

function print_data_to_last_row_sheet(sheet, array) {
  var last_row = sheet.getLastRow();
  sheet.getRange(last_row + 1, 1, array.length, array[0].length).setValues(array);
}
  
