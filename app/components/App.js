import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import Dropdown from 'react-dropdown';
import "react-dropdown/style.css";

const server = "http://localhost:8080";
//
// The following variables define the entire screen components
// Any subcomponents meant to be reused should be defined at the specified section below
//

var LogIn = React.createClass({
    render : function() { return (
    	<div className="LogIn">
    		<center>
	    	<h1>Log In</h1>
	    	<form>
			  Username:<br />
			  <input type="text" name="user" /><br />
			  Password:<br />
			  <input type="text" name="pass" /><br />
	    	</form>
	        <br />
	    	<button>Login</button>
	    	<button onClick={this.nRegistration}>Register</button>
	    	<button onClick={this.nPassengerFunctionality}>Go To Passenger Functionality</button>
	    	<button onClick={this.nAdminFunctionality}>Go To Admin Functionality</button>
	    	</center>
    	</div>
    	);
	},
    nRegistration : function() { showRegistration(); },
    nPassengerFunctionality : function() { showPassengerFunctionality(); },
    nAdminFunctionality : function() { showAdminFunctionality(); }
});

var Registration = React.createClass({
    render : function() { return (
    	<div class="Registration">
    		<center>
	    	<h1>Registration</h1>
	    	<hr />
	    	 <form>
			  Username:
			  <input type="text" name="user" /><br />
			  Email:
			  <input type="text" name="email" /><br />
			  Password:
			  <input type="text" name="pass" /><br />
			  Confirm Password:
			  <input type="text" name="confirm" /><br />
			  <h3>Breeze Card</h3>
			  <input type="radio" name="useBreezeCard" /><label>Use my existing Breeze Card</label><br />
			  Card Number:
			  <input type="text" name="cardNumber" /><br />
			  <input type="radio" name="getNewCard" /><label>Get a new Breeze Card</label><br />
	    	</form>
	    	<hr />
	        <br />

	    	<button>Create Account</button>
	    	<button onClick={this.nLogin}>Back</button>
	    	</center>

    	</div>
    	);
	},
	nLogin : function() { showLogIn(); }
});

var PassengerFunctionality = React.createClass({
    render : function() { return (
    	<div class="PassengerFunctionality">
	    	<p>Welcome To Marta</p>

	    	<p>Passenger Functionality</p>

	    	<div><label>Breeze Card </label><input type="text" /><a href="#"onClick={this.nManageCards}>Manage Cards</a></div>
	    	<br/>
	    	<label>Balance </label><label>$12 </label>
	    	<br/>
	    	<br/>
	    	<label>Start At </label>
	    	<select>
 				<option value="Dunwoody">Dunwoody</option>
				<option value="North Ave">NA</option>
				<option value="North Spring">northspring</option>
				<option value="Midtown">midtown</option>
			</select><a href="#">Start Trip</a>
			<br/>
			<br/>
			<label>End At </label>
	    	<select>
 				<option value="Dunwoody">Dunwoody</option>
				<option value="North Ave">NA</option>
				<option value="North Spring">northspring</option>
				<option value="Midtown">midtown</option>
			</select><a href="#">End Trip</a>
			<br/>
			<br/>
	    	<button onClick={this.nTripHistory}>Go To Trip History</button>
	    	<br/>
	    	<button onClick={this.nLogin}>Back</button>
    	</div>
    	);
	},
	nTripHistory : function() { showTripHistory(); },
	nManageCards : function() { showManageCards(); },
	nLogin : function() { showLogIn(); }
});

var ManageCards = React.createClass({
    getInitialState : function() {
        var oColumns = [
            { Header: 'Card Number', accessor: 'cardnum' },
            { Header: 'Value', accessor: 'val' },
            { Header: ' ', accessor: 'remove' },
        ];
        var oData = [
            { cardnum: '1111 2222 3333 4444', val: '15.50', remove: <a href="#">Remove</a> },
            { cardnum: '5555 6666 7777 8888', val: '20.12', remove: <a href="#">Remove</a> }
        ];
        return { columns: oColumns, data: oData };
    },
    render : function() { return (
    	<div class="ManageCards">
	    	<p>Manage Cards</p>
            <p>Breeze Cards</p>
            <ReactTable
                    data={this.state.data}
                    columns={this.state.columns}
                    defaultPageSize={5}
                    />
		    	<br/>
                <input type="text" />
	    	    <button>Add Card</button>
	    	    <br/>
	    	    <br/>
	    	    <p>Add Value to Selected Card</p>
	    	    <div><label>Credit Card # </label><input type="text" /></div>
	    	    <br/>
	    	    <div><label>Value </label><input type="text" /></div>
	    	    <br/>
		    	<button onClick={this.nPassengerFunctionality}>Back To Passenger Functionality</button>
	    	</div>
    	);
	},
	nPassengerFunctionality : function() { showPassengerFunctionality(); }
});

var TripHistory = React.createClass({
    getInitialState : function() {
        var oColumns = [
            { Header: 'Time', accessor: 'time' },
            { Header: 'Source', accessor: 'source' },
            { Header: 'Destination', accessor: 'destination' },
            { Header: 'Fare Paid', accessor: 'fairpaid' },
            { Header: 'Card #', accessor: 'card' },
        ];
        var oData = [
            { time: '11:11', source: 'North Ave',destination: 'Dunwoody', fairpaid: '$1.50', card: '4411' },
            { time: '11:22', source: 'Dun',destination: 'NA', fairpaid: '$3.50', card: '1122' }
        ];
        return { columns: oColumns, data: oData };
    },
    render : function() { return (
    	<div class="TripHistory">
	    	<p>Trip History</p>
	    	<div><label>Start </label><input type="text" /></div>
	    	<br/>
	    	<div><label>End </label><input type="text" /></div>
	    	<br/>
	    	<button onClick={this.nUpdated}>Update</button>
	    	<button onClick={this.nReset}>Reset</button>
	    	<br/>
	    	<ReactTable
                    data={this.state.data}
                    columns={this.state.columns}
                    defaultPageSize={5}
                    />
		    	<br/>
	    	<button onClick={this.nPassengerFunctionality}>Back to Passenger Functionality</button>
    	</div>
    	);
	},
	nPassengerFunctionality : function() { showPassengerFunctionality(); }
});

var AdminFunctionality = React.createClass({
    render : function() { return (
    	<div class="AdminFunctionality">
	    	<p>Admin Functionality</p>
	    	<button onClick={this.nBreezecardManagement}>Go To Breezecard Management</button>
	    	<button onClick={this.nStationManagement}>Go To Station Management</button>
	    	<button onClick={this.nPassengerFlowReport}>Go To PassengerFlowReport</button>
	    	<button onClick={this.nSuspendedCards}>Go To Suspended Cards</button>
	    	<button onClick={this.nLogin}>Back</button>
    	</div>
    	);
	},
	nBreezecardManagement : function() { showBreezecardManagement(); },
	nStationManagement : function() { showStationManagement(); },
	nPassengerFlowReport : function() { showPassengerFlowReport(); },
	nSuspendedCards : function() { showSuspendedCards(); },
	nLogin : function() { showLogIn(); }
});

const breezeCardManagementOptions = ['Card #', 'Value', 'Owner'];
var BreezecardManagement = React.createClass({

    getInitialState : function() {

		var oColumns = [
            {
                Header: '',
                accessor: 'editButton',
                Cell: (row) => (
                    <div>
                        <input type="radio" name="stationtype" value="select"
                                onClick={() => this.selectRow(row)}/>
                    </div>
                ),
                maxWidth: 40
            },
			{ Header: 'Card #', accessor: 'BreezecardNum' },
			{ Header: 'Value', accessor: 'Value' },
			{ Header: 'Owner', accessor: 'BelongsTo' }
		];

		return { columns: oColumns, data: [], owner: '', suspended: '', cardNumber: '',
                 valueLow: '', valueHigh: '', setValue: '', transfer: '', sort: '', selected: breezeCardManagementOptions[0]};
    },
    selectRow : function(row) {
        this.setState( {selectedRow: row.original} );
    },
    render : function() {
        const style5 = {
            paddingRight: '5px',
            paddingBottom: '5px'
        };
        const style40 = {
            paddingLeft: '40px'
        };

        const defaultOption = this.state.selected;

        return (
    	<div class="BreezecardManagement">
	    	<p>Breeze Card Management</p>
            <h3> Breeze Cards </h3>
            <h5> Search/Filter </h5>
            <p>
                <text style={style5}>
                    Owner:
                </text>
                <span style={style5}>
                    <input type="text" name="owner_textbox" onChange={this.ownerChange}/>
                </span>
                <input type="checkbox" name="suspended_checkbox" id="suspended_checkbox" onClick={this.suspendedChange} />
                <label for="suspended_checkbox"> Show Suspended Cards </label>
            </p>
            <p>
                <text style={style5}>
                    Card Number:
                 </text>
                <input type="text" name="card_number_textbox" onChange={this.cardNumberChange} />
                <span style={style40}>
                    <button> Reset </button>
                </span>
            </p>
            <span style={style5}>
                <text style={style5}>
                    Value between:
                </text>
                <input type="text" name="value_start_textbox" size='6' onChange={this.valueLowChange}/>
            </span>
            <text style={style5}>
                and:
            </text>
            <input type="text" name="value_end_textbox" size='6' onChange={this.valueHighChange}/>
            <span style={style40}>
                    <button onClick={this.updateData}> Update Filter </button>
            </span>
            <p></p>
            <text style={style5}>
                Order by:
            </text>
            <div style={{width: "250px"}}>
                <Dropdown options={breezeCardManagementOptions} onChange={this.sortChange} value={defaultOption}/>
            </div>
            <p></p>
			<ReactTable
				    data={this.state.data}
				    columns={this.state.columns}
					defaultPageSize={15}
					sortable={false}
                    defaultSortMethod={undefined}/>
            <p>
                <span style={style5}>
                    <input type="text" name="card_value_textbox" onChange={this.setValueChange}/>
                </span>
                <button>Set Value of Selected Card</button>
            </p>
            <p>
                <span style={style5}>
                    <input type="text" name="transfer_card_textbox" onChange={this.transferChange}/>
                </span>
                <button>Transfer Selected Card</button>
            </p>


            <button onClick={this.nAdminFunctionalitya}>Back</button>
    	</div>
    	);
	},
    componentDidMount : function() {
        this.updateData();
    },
    ownerChange: function(e) {
        this.setState({owner : e.target.value});
    },
    sortChange: function(e) {
        if (e.value == breezeCardManagementOptions[0]) {
            this.setState({sort: "BreezecardNum"});
        } else if (e.value == breezeCardManagementOptions[1]) {
            this.setState({sort: "Value"});
        } else {
            this.setState({sort: "BelongsTo"});
        }
        this.setState({selected: e});

    },
    suspendedChange: function(e) {
        this.setState({suspended : e.target.checked});
    },
    cardNumberChange: function(e) {
        this.setState({cardNumber: e.target.value});
    },
    valueLowChange: function(e) {
        this.setState({valueLow: e.target.value});
    },
    valueHighChange: function(e) {
        this.setState({valueHigh: e.target.value});
    },
    setValueChange: function(e) {
        this.setState({setValue: e.target.value});
    },
    transferChange: function(e) {
        this.setState({transfer: e.target.value});
    },
    updateData: function() {
        fetch(server + '/adminBreezeCardData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "owner": this.state.owner,
             "cardNumber": this.state.cardNumber,
             "valueLow": this.state.valueLow,
             "valueHigh": this.state.valueHigh,
             "suspended": this.state.suspended,
             "sort": this.state.sort
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
    },
    nAdminFunctionalitya : function() { showAdminFunctionality(); }
});

var SuspendedCards = React.createClass({
	getInitialState : function() {
			var oColumns = [
				{ Header: 'Card #', accessor: 'cardNumber' },
				{ Header: 'New Owner', accessor: 'newOwner' },
				{ Header: 'Date Suspended', accessor: 'dateSuspended' },
				{ Header: 'Previous Owner', accessor: 'prevOwner'}
			];
			var oData = [
				{ cardNumber: '1446 2121 0808 1229', newOwner: 'John H', dateSuspended: '11-15-2017 4:20pm', prevOwner: 'Alex C' },
				{ cardNumber: '1581 9910 0010 4404', newOwner: 'Ryan A', dateSuspended: '11-20-2017 4:20am', prevOwner: 'Sam C' }
			];
			return { columns: oColumns, data: oData };
		},
	  	render : function() {
	  		return (
		    	<div class="StationManagement">
			    	<h1>Suspended Cards</h1>
			    	<ReactTable
					    data={this.state.data}
					    columns={this.state.columns}
					    defaultPageSize={10}
					  /><br />
					 <center>
			    	<button>Assign Selected Card to New Owner</button><br /><br />
			    	<button>Assign Selected Card to Previous Owner</button><br /><br />
			    	<br />
			    	<button onClick={this.nAdminFunctionality}>Back To Admin Functionality</button>
		    		</center>
		    	</div>
	    	);
		},
	nAdminFunctionality : function() { showAdminFunctionality(); }
});


var PassengerFlowReport = React.createClass({
    getInitialState : function() {
		var oColumns = [
			{ Header: 'Station Name', accessor: 'station' },
			{ Header: '# Passengers In', accessor: 'pass_in' },
			{ Header: '# Passengers Out', accessor: 'pass_out' },
			{ Header: 'Flow', accessor: 'flow' },
			{ Header: 'Revenue', accessor: 'revenue'}
		];
		var oData = [
			{ station: 'New Donk Station', pass_in: '100', pass_out: '50', revenue: '$4.20' }
		];
		return { columns: oColumns, data: oData };
    },
    render : function() {
        const style5 = {
            paddingRight: '5px',
            paddingBottom: '5px'
        };
        const style40 = {
            paddingRight: '40px'
        }

        return (
    	<div class="PassengerFlowReport">
	    	<p>Passenger Flow Report</p>
            <p>
                <span style={style5}>
                    <text style={style40}>
                        Start Time
                    </text>
                    <input type="text" name="start_time_textbox"/>
                </span>
                <span style={style5}>
                    <button>Update</button>
                </span>
                <button>Reset</button>
            </p>
            <p>
                <span style={style5}>
                    <text style={style40}>
                        End Time
                    </text>
                    <input type="text" name="end_time_textbook"/>
                </span>
            </p>
            <p>
				<ReactTable
				    data={this.state.data}
				    columns={this.state.columns}
					defaultPageSize={10}
					sortable={false}
				  />
            </p>
	    	<button onClick={this.nAdminFunctionality}>Back</button>
    	</div>
    	);
	},
	nAdminFunctionality : function() { showAdminFunctionality(); }
});

var StationManagement = React.createClass({
	getInitialState : function() {
		var oColumns = [
			{
                Header: '',
                accessor: 'editButton',
                Cell: (row) => (
                    <div>
						<input type="radio" name="stationtype" value="select"
								onClick={() => this.selectRow(row)}/>
					</div>
                ),
                maxWidth: 40
            },
			{ Header: 'Station Name', accessor: 'Name' },
			{ Header: 'Stop ID', accessor: 'StopID' },
			{ Header: 'Fare', accessor: 'EnterFare' },
			{ Header: 'Status', accessor: 'ClosedStatus'}
		];
		return { columns: oColumns, data: [], selectedRow: null };
	},
	selectRow : function(row) {
		this.setState( {selectedRow: row.original} );
	},
	componentDidMount : function() {
		fetch(server + "/stationManagementData")
		.then(response => response.json())
		.then(data => this.setState({ data: data })
		);
	},
  	render : function() {
  		return (
	    	<div class="StationManagement">
		    	<h1>Station Listing</h1>
		    	<ReactTable
				    data={this.state.data}
				    columns={this.state.columns}
					sortable={false}
				  />
		    	<button onClick={this.nViewStation}>View Station</button>
		    	<button onClick={this.nCreateStation}>Create Station</button>
		    	<br />
		    	<button onClick={this.nAdminFunctionality}>Back To Admin Functionality</button>
	    	</div>
    	);
	},
	nViewStation : function() {
		if (!this.state.selectedRow) {
			alert('You need to choose a station before you can view it.');
		} else {
			showViewStation(this.state.selectedRow.StopID);
		}
	},
	nCreateStation : function() { showCreateStation(); },
	nAdminFunctionality : function() { showAdminFunctionality(); }
});

var ViewStation = React.createClass({
	getInitialState : function() {
		return { name: '', id: '', fare: -1, open: 'closed', intersection: '', newFare: '' }
	},
    render : function() { return (
    	<div class="ViewStation">
	    	<h1>{this.state.name} (id {this.state.id})</h1><br />
	    	<p>Current Fare: ${this.state.fare}</p>
	    	<label>$</label><input type="text" onChange={this.fareChange}/>
	    	<button onClick={this.updateFare}>Update Fare</button>
	    	<p>Nearest Intersection: {this.state.intersection}</p>
	    	<p>Should the station be open or closed?</p>
			<form>
				<input type="radio" name="open" value="open" checked={this.state.open=='open'}
						onChange={this.openChange} />
				<label>Open</label><br />
				<input type="radio" name="open" value="closed" checked={this.state.open=='closed'}
						onChange={this.openChange} />
				<label>Closed</label><br />
			</form>
			<button onClick={this.updateOpen}>Update</button>
	    	<br /><br /><button onClick={this.nStationManagement}>Back to Station Management</button>
    	</div>
    	);
	},
	componentDidMount : function() {
		this.refreshState();
	},
	refreshState : function() {
		console.log('refreshing state');
		fetch(server + '/viewStationData', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "StopID": this.props.initialId
			})
		}).then(function(res){ return res.json(); })
		.then(data => this.setState(
			{
					name: data.Name, id: data.StopID, fare: data.EnterFare,
					open: (data.ClosedStatus) ? "closed" : "open",
					intersection: (data.intersection != null) ? data.intersection
						: 'Not available for trains'
			}));
	},
	fareChange : function(e) {
		this.setState({ newFare: e.target.value} );
	},
	openChange : function(e) {
		this.setState({ open: e.target.value });
	},
	updateOpen : function() {
		fetch(server + '/updateOpen', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "StopID": this.state.id,
				 "open": this.state.open
			})
		});
	},
	updateFare : function() {
		if (this.state.newFare < 0 || this.state.newFare > 50) {
			alert('Fares must be between $0.00 and $50.00');
		} else {
			fetch(server + '/updateFare', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					"StopID": this.state.id,
					"EnterFare": this.state.newFare
				})
			}).then(function(response) {
				return response.json();
			}).then(data => this.refreshState() );
		}
	},
	nStationManagement : function() { showStationManagement(); }
});

var CreateStation = React.createClass({
	getInitialState : function() {
		return { name: '', id: '', fare: 0.0, type: "train", open: "closed", nearest: '', message: "" };
	},
	render : function() { return (
    	<div class="CreateStation">
	    	<div><label>Station Name   </label><input type="text" onChange={this.nameChange} /></div>
	    	<div><label>Stop ID   </label><input type="text" onChange={this.idChange} /></div>
	    	<div><label>Entry Fare   $</label><input type="text" onChange={this.fareChange} /></div><br />
	    	<p>Station Type</p>
	    	<form>
	    		<input type="radio" name="stationtype" value="bus" checked={this.state.type!='train'} onChange={this.typeChange} />
				<label>Bus</label><br />
	    		<label>Nearest Intersection (Optional)</label>
				<input type="text" onChange={this.nearestChange}/><br />
	    		<input type="radio" name="stationtype" value="train" checked={this.state.type=='train'} onChange={this.typeChange} />
				<label>Train</label><br />
				<p>Should the station be open or closed?</p>
				<input type="radio" name="open" value="open" checked={this.state.open!='closed'} onChange={this.openChange} />
				<label>Open</label><br />
	    		<input type="radio" name="open" value="closed" checked={this.state.open=='closed'} onChange={this.openChange} />
				<label>Closed</label>
	    	</form>
			<br />
	    	<button onClick={this.createStation}>Create Station</button>
			<p>{this.state.message}</p>
	    	<br /><br /><button onClick={this.nStationManagement}>Back to Station Management</button>
    	</div>
    	);
	},
	nameChange : function(e) {
		this.setState({ name: e.target.value} );
	},
	idChange : function(e) {
		this.setState({ id: e.target.value} );
	},
	fareChange : function(e) {
		this.setState({ fare: e.target.value } );
	},
	typeChange : function(e) {
		this.setState({ type: e.target.value} );
	},
	openChange : function(e) {
		this.setState({ open: e.target.value });
	},
	nearestChange : function(e) {
		this.setState( { nearest: e.target.value })
	},
	createStation : function() {
		if (this.state.id == '' || this.state.name == '' || this.state.fare == '') {
			alert('Please fill out all non-optional fields');
			return;
		}
		if (this.state.message != '')
			this.setState( { message: '' });
		fetch(server + '/createStation', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "StopID": this.state.id,
				 "Name": this.state.name,
				 "EnterFare": this.state.fare,
				 "ClosedStatus": this.state.open,
				 "IsTrain": this.state.type,
				 "Intersection": this.state.nearest
			})
		}).then(function(res){ return res.json(); }).then(function(data){ alert( data.message ) });
	},
	nStationManagement : function() { showStationManagement(); }
});

//
// Any components meant to be reused among the screens should be defined below
//



//
// Rendering functions for each screen called in onclicks
//

function showLogIn() {
	ReactDOM.render(<LogIn />, document.getElementById('root'));
}

function showRegistration() {
	ReactDOM.render(<Registration />, document.getElementById('root'));
}

function showPassengerFunctionality() {
	ReactDOM.render(<PassengerFunctionality />, document.getElementById('root'));
}

function showManageCards() {
	ReactDOM.render(<ManageCards />, document.getElementById('root'));
}

function showTripHistory() {
	ReactDOM.render(<TripHistory />, document.getElementById('root'));
}

function showViewStation(stationId) {
	ReactDOM.render(<ViewStation
						initialId={stationId} />, document.getElementById('root'));
}

function showCreateStation() {
	ReactDOM.render(<CreateStation />, document.getElementById('root'));
}

function showAdminFunctionality() {
	ReactDOM.render(<AdminFunctionality />, document.getElementById('root'));
}

function showPassengerFlowReport() {
	ReactDOM.render(<PassengerFlowReport />, document.getElementById('root'));
}

function showSuspendedCards() {
	ReactDOM.render(<SuspendedCards />, document.getElementById('root'));
}

function showBreezecardManagement() {
	ReactDOM.render(<BreezecardManagement />, document.getElementById('root'));
}

function showStationManagement() {
	ReactDOM.render(<StationManagement />, document.getElementById('root'));
}

showLogIn();
