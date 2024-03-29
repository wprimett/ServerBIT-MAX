inlets = 5;
outlets = 3;

var lbls=[];
var dev_mask = [0];
var num_devices= 1;
var dev_mask = [0];
var chnlz = false;

var riot_ch_mask = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
var riot_lbls = ["ACC_X", "ACC_Y", "ACC_Z", "GYRO_X", "GYRO_Y", "GYRO_Z", "MAG_X", "MAG_Y", "MAG_Z",
        "Q1", "Q2", "Q3", "Q4", "PITCH", "YAW", "ROLL", "HEAD", "IO", "SWITCH", "A1", "A2"];

var all_lbls = {"bitalino" : [],
			"r-iot" : riot_lbls
			};
var dev_types = ["bitalino"];
var buffer_length = 1;
var osc_enable = false;
var sep_chnlz = false;

function get_ch_mask(id)
{
	ch_mask_dict = {"bitalino" : ch_mask, "r-iot" : riot_ch_mask};
	new_ch_mask = ch_mask_dict[dev_types[id]];
	return new_ch_mask;
}

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
	var data = dev_data;
	lbls = all_lbls[dev_types[0]];
	ch_mask = get_ch_mask(0);
	var json_out = new Dict("str_json");
	var res = ''
	res = '{';
	///single device 
	if (num_devices < 2){
		ch_mask.forEach(function(i) {
			data_str = data[i];
			res += '"' + lbls[i] + '": '  + JSON.stringify(data_str) + ",";
		});
		res = res.slice(0, -1)+'}';
	///multiple devices 
	}else{
		dev_mask.forEach(function(dev_id) {
			lbls = all_lbls[dev_type[dev_id]];
			ch_mask = get_ch_mask(dev_id);
			res = res + '"' + dev_id + '": ' + '{';
			ch_mask.forEach(function(i) {
				//TODO: data[dev_id]
				res += '"' + lbls[i] + '": '  + JSON.stringify(data[dev_id][i]) + ",";
			});
			res = res.slice(0, -1)+'},';
		});
		res = res.slice(0, -1)+'}';
	}
	json_out.parse(res.toString());
	output_ws(json_out);
	if (num_devices < 2) 
		res = '{"' + 0 + '": ' + res + '}';
	json_out.parse(res.toString());
	if (osc_enable){
		if (!sep_chnlz) {
			output_osc_unlabled(json_out);
		}
		else{
			output_osc(json_out);
		}
	}
}

function update() {
	if (inlet == 1){
		osc_enable = Boolean(Number(this.patcher.getnamed("osc_enable").getvalueof()));
    	sep_chnlz = Boolean(Number(this.patcher.getnamed("sep_chnlz").getvalueof()));
	}
}

function list(){
	if (inlet == 0) {
		var device_data = arrayfromargs(arguments);
		get_ws_dict(device_data);
	}
	if (inlet == 2) {
		ch_mask = arrayfromargs(arguments);
		ch_mask.push(6, 7, 8, 9); //include 4 I/Os
		start_aquitition = Boolean(Number(this.patcher.getnamed("start_aquitition").getvalueof()));
		if (osc_enable && start_aquitition){
			outlet(2, [ch_mask.length, JSON.stringify(dev_mask).replace(/[[\]]/g,'')]);
		}
		post("channel mask: " + ch_mask + "\n");
	} 
	if (inlet == 3) {
		device_type = arrayfromargs(arguments);
		device_id = String.fromCharCode(device_type[0]);
		device_type = String.fromCharCode.apply(null, device_type).slice(2).toLowerCase();
		if (device_type === "bitalino" || device_type === "r-iot") {
			post("new device type:" + device_type);
			dev_types[device_id] = device_type;
		}
	}
}

function msg_int(v)
{
	if (inlet == 0) {			
		num_devices = v+1;
		dev_mask = range(num_devices);
	}
	if (inlet == 4) {
		buffer_length = v;
	}
}

function text()
{
	if (inlet == 0) {
		//var device_data = arrayfromargs(arguments);
		//post(device_data);
		//get_ws_dict(device_data);
	}
	if (inlet == 1) {			
		lbls = arrayfromargs(arguments);
		lbls.push("I1", "I2", "O1", "O2");
		all_lbls["bitalino"] = lbls;
		post("json labels: " + lbls + "\n");
	}
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

function stringify_json_array(data){
	return "[" + JSON.stringify(data) + "]";
}

function charCodeString2string (s){
	if(typeof(s) != 'string') return false;
		s2 = '';
		a = s.split('-');
		f = a.length;
		for (i = 0; i<f; i++) {
			s2 += String.fromCharCode(parseInt(a[i]));
		}
		return s2;
}
	
var StaticBuffer = function(max_length){
  buffer = new Array(0); 
  return {
	get_buffer : function(){return buffer;},
    get  : function(key){return buffer[key];},
	get_len : function(){return buffer.length;},
    write : function(item){
		if (buffer.length == max_length){
			buffer = new Array(0);
		}
		buffer.unshift(item);
		post(buffer);
    }
  };
};