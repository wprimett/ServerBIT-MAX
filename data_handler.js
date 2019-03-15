inlets = 4;
outlets = 3;

var lbls=[];
var ch_mask=[0];
var num_devices=1;
var dev_mask = [0];
var sep_chnlz = false;

function output_osc(json_data){
	//post("calling device IDs: " + dev_mask + "\n");
	
	var osc_str=[];
	dev_mask.forEach(function(dev_id) {
		ch_mask.forEach(function(i) {
			var data = json_data.get(lbls[i]);
			osc_str.push("/"+dev_id+"/bitalino/"+lbls[i] + " " + data);
		});
	});
	outlet(1, osc_str);
}

function output_osc_unlabled(array_data){
	//post("calling device IDs: " + dev_mask + "\n");
	var osc_str=[];
	var data = 	JSON.stringify(array_data)
	data = data.replace(/[[\]]/g,'')
	data = data.replace(/,/g, ' ')
	dev_mask.forEach(function(dev_id) {
		osc_str.push("/"+dev_id+"/bitalino" + " " + data);
	});
	outlet(1, osc_str);
}

function output_ws(json_data)
{
	var output=json_data.stringify(); //, null, "\t"
	outlet(0, output);
}

function get_ws_dict()
{
	var toggle = this.patcher.getnamed("sep_chnlz");
    sep_chnlz = Boolean(Number(toggle.getvalueof()));
	var data = [100, 200];
	
	//var data = 156;
	var json_out = new Dict("str_json");
	var res = ''
	res = '{';
	if (num_devices < 2){
		ch_mask.forEach(function(i) {
			res += '"' + lbls[i] + '": '  + JSON.stringify(data) + ",";
		});
		res = res.slice(0, -1)+'}';
	}else{
		dev_mask.forEach(function(dev_id) {
			res = res + '"' + dev_id + '": ' + '{';
			ch_mask.forEach(function(i) {
				res += '"' + lbls[i] + '": '  + JSON.stringify(data) + ",";
			});
			res = res.slice(0, -1)+'},';
			//post(res);
			//res = '{' + '"' + dev_id + '": ' + res;
		});
		res = res.slice(0, -1)+'}';
		post(res);
	}
	json_out.parse(res.toString());
	output_ws(json_out);
	if (!sep_chnlz) {
		output_osc_unlabled(data);
	}
	else{
		output_osc(json_out);
	}
}

function bang()
{
	if (lbls.length > 0){
		get_ws_dict();
	}else{
		post("please enter label names");
		outlet(2, "please enter label names");
	}
}

function list(){
	ch_mask = arrayfromargs(arguments);
	post("channel mask: " + ch_mask + "\n");
}

function text()
{
	lbls = arrayfromargs(arguments);
	post("json labels: " + lbls + "\n");
	//get_ws_dict();
}

function msg_int(v)
{
	num_devices = v+1;
	dev_mask = range(num_devices);
}

//http://cwestblog.com/2013/12/16/javascript-range-array-function/
function range(start, edge, step) {
  // If only one number was passed in make it the edge and 0 the start.
  if (arguments.length == 1) {
    edge = start;
    start = 0;
  }
 
  // Validate the edge and step numbers.
  edge = edge || 0;
  step = step || 1;
 
  // Create the array of numbers, stopping befor the edge.
  for (var ret = []; (edge - start) * step > 0; start += step) {
    ret.push(start);
  }
  return ret;
}
