inlets = 1;
outlets = 1;

var buffer_length = 10;
var input_buffer_list = [];
var output_buffer_list = [[]]

function num_channels(len){
	buffer_length = len
	for (i = 0; i < 11; i++){
		var ib = new CircularBuffer(buffer_length);
		input_buffer_list.push(ib);
	}
}

function list() {
	var device_data = arrayfromargs(arguments);
	for (i = 0; i < 11; i++){
		input_buffer_list[i].write(device_data[i]);
		output_buffer_list[i] = input_buffer_list[i].get_buffer();
	}
	outlet(0, output_buffer_list);
}

//ringbuffer adapted from example: https://codepen.io/anon/pen/dLXGVG?editors=1111
function CircularBuffer (len) {
    this.memory = new Array(len);
    this.head = 0;
    this.tail = 0;
    this.isFull = false;

 	this.get_buffer = function(){
		return this.memory;
	}
  
  	this.read = function() {
	    if (this.tail === this.head && !this.isFull) {
	      console.log('Nothing to read.');
	    } else {
	      this.tail = this.next_val(this.tail);
	      this.isFull = false;
	      return this.memory[this.tail];
	    }
	  }
  
	  this.write = function(value) {
	    if (this.isFull) {
	      return;
	    } else {
	      this.head = this.next_val(this.head);
	      this.memory[this.head] = value;
	      if (this.head === this.tail) {
	        this.isFull = true;
	      }
	    }
	  }
	  
	  this.next_val = function(n) {
	    var nxt = n + 1;
	    if (nxt === this.memory.length) {
	      return 0;
	    } else {
	      return nxt;
	    }
	  }
	}

