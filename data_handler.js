inlets = 3;
outlets = 3;

var lbls=[];
var dev_mask = [0];
var num_devices=1;
var dev_mask = [0];
var chnlz = false;

function output_osc(json_data){	
	var osc_str=[];
	dev_mask.forEach(function(dev_id) {
		ch_mask.forEach(function(i) {
			var data = json_data.get(JSON.stringify(dev_id));
			data = data.get(lbls[i]);
			osc_str.push("/"+dev_id+"/bitalino/"+lbls[i] + " " + data);
		});
	});
	outlet(1, osc_str);
}

function output_osc_unlabled(json_data){
	var osc_str=[];
	dev_mask.forEach(function(dev_id) {
		data = []
		var dev_id_data = json_data.get(JSON.stringify(dev_id));
		ch_mask.forEach(function(i) {
			data.push(dev_id_data.get(lbls[i]));
		});
		osc_str.push("/"+dev_id+"/bitalino" + " " + data);
	});
	outlet(1, osc_str);
}

function output_ws(json_data)
{
	var output=json_data.stringify(); //, null, "\t"
	outlet(0, output);
}

function get_ws_dict(dev_data)
{
	var toggle = this.patcher.getnamed("sep_chnlz");
    sep_chnlz = Boolean(Number(toggle.getvalueof()));
	var data = dev_data;
	
	//var data = 156;
	var json_out = new Dict("str_json");
	var res = ''
	res = '{';
	if (num_devices < 2){
		ch_mask.forEach(function(i) {
			res += '"' + lbls[i] + '": '  + JSON.stringify(data[i]) + ",";
		});
		res = res.slice(0, -1)+'}';
	}else{
		dev_mask.forEach(function(dev_id) {
			res = res + '"' + dev_id + '": ' + '{';
			ch_mask.forEach(function(i) {
				//TODO: data[dev_id]
				res += '"' + lbls[i] + '": '  + JSON.stringify(data[i]) + ",";
			});
			res = res.slice(0, -1)+'},';
			//post(res);
			//res = '{' + '"' + dev_id + '": ' + res;
		});
		res = res.slice(0, -1)+'}';
	}
	json_out.parse(res.toString());
	output_ws(json_out);
	if (num_devices < 2) 
		res = '{"' + 0 + '": ' + res + '}';
		json_out.parse(res.toString());
	if (!sep_chnlz) {
		output_osc_unlabled(json_out);
	}
	else{
		output_osc(json_out);
	}
}

function bang()
{

}

function list(){
	if (inlet == 0) {
		var device_data = arrayfromargs(arguments);
		get_ws_dict(device_data);
	} else if (inlet == 2) {
		ch_mask = arrayfromargs(arguments);
		ch_mask.push(6, 7, 8, 9); //include 4 I/Os
		post("channel mask: " + ch_mask + "\n");
	} 
}

function msg_int(v)
{
	num_devices = v+1;
	dev_mask = range(num_devices);
}

function text()
{
	lbls = arrayfromargs(arguments);
	lbls.push("I1", "I2", "O1", "O2");
	post("json labels: " + lbls + "\n");
	//get_ws_dict();
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
