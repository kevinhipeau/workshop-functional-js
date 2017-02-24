var expect = require('chai').expect;

var transformCheckpoint = require('../src/program').transformCheckpoint;


describe('Function transformCheckpoint', function() {

	it('Function transformCheckpoint without parameter should return false', function() {
		expect(transformCheckpoint()).to.be.false;
	});
	it('Function transformCheckpoint avec parametre doit retourner true et ne pas modifier les parametres', function() {
		var tmp = {
			id: 'whataw0nd3rful1d',
			uuid: 'whataw0nd3rful1d',
			address: 'unknown',
			addressType: 'unknown',
			connectable: true,
			advertisement: {
				localName: undefined,
				txPowerLevel: undefined,
				manufacturerData: undefined,
				serviceData: [],
				serviceUuids: [ 'abcd' ]
			},
			rssi: -66,
			services: null,
			state: 'outofcontrol'
		}
		expect(transformCheckpoint(tmp)).to.be.true;
		
		expect(tmp.id).to.equal('whataw0nd3rful1d');
		expect(tmp.address).to.equal('unknown');
		expect(tmp.addressType).to.equal('unknown');
		expect(tmp.rssi).to.equal(-66);
		expect(tmp.services).to.equal(null);	
	});

});