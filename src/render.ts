declare var phantom: any;
var page: any = require('webpage').create();
var system: any = require('system');
var address: string;
var output: string;

address = system.args[1];
output = system.args[2];
page.viewportSize = { width: 1024, height: 768 };
page.paperSize = { format: 'A4', orientation: 'portrait', margin: '1cm' };

page.open(address, function (status) {
  if (status !== 'success') {
    console.log('Unable to load the address!');
    console.log(status);
    console.log(address);
    console.log(output);
    phantom.exit();
  } else {
    page.render(output);
    phantom.exit();
  }
});
