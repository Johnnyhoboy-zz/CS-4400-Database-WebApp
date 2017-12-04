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

var chosenCard = '';
var chosenStarting= '';
var chosenEnding = '';
var PassengerFunctionality = React.createClass({

	getInitialState : function() {
		return { data: [], cardData: [], endData: [],selectedCard: chosenCard, selectedStart: chosenStarting, selectedEnd: chosenEnding, value: '', fare: '', prompt: 'Start Trip', disable: '', count: '', current: {}, currentE: {} }
	},
	componentDidMount : function() {
		fetch(server + "/stationListData")
		.then(response => response.json())
		.then(data => {console.log(data); this.setState({ data: data });}
		);

		fetch(server + "/stationListData")
		.then(response => response.json())
		.then(data => this.setState({ endData: data })
		);

		fetch(server + "/passengerCardData")
		.then(response => response.json())
		.then(data => this.setState({ cardData: data })
		);

		fetch(server + "/inProgress")
		.then(response => response.json())
		.then(data => {console.log(data); this.setState({ count: data.count }, function () {
				if(this.state.count > 0) {
					this.setState({ prompt: 'In Progress', disable: 'true'} );
				}
			});}
		);

		if(this.state.count > 0) {
			this.setState({ prompt: 'In Progress', disable: 'true'} );
		}
	},
    render : function() { 
    	var cards = this.state.cardData.map(function(items) {
    		return items.BreezecardNum;
    	});
		return (
    	
    	<div class="PassengerFunctionality">
	    	<p>Welcome To Marta</p>
	    	
	    	<p>Passenger Functionality</p>

	    	<div style={{width: "250px"}}>
	    		<label>Breeze Card </label>
	    		<Dropdown disabled={this.state.disable} options={cards} onChange={this.selectedCard} value={this.state.selectedCard} />
	    		<a href="#"onClick={this.nManageCards}>Manage Cards</a>
	    	</div>
	    	<br/>
	    	<p>Balance: ${this.state.value}</p>
	    	<br/>
	    	<br/>
	    	<div style={{width: "250px"}}>
	    		<label>Start At </label>
	    		<Dropdown options={this.state.data} onChange={this.selectedStart} value={this.state.current.label} />
	    		<a href="#"onClick={this.startTrip}>{this.state.prompt}</a>
			</div>
			<br/>
			<br/>
			<div style={{width: "250px"}}>
				<label>End At </label>
	    		<Dropdown options={this.state.endData} onChange={this.selectedEnd} value={this.state.currentE.label} />
	    		<a href="#"onClick={this.endTrip}>End Trip</a>
			</div>
			<br/>
			<br/>
	    	<button onClick={this.nTripHistory}>Go To Trip History</button>
	    	<br/>
	    	<button onClick={this.nLogin}>Back</button>
    	</div>
    	); 
	},
	selectedCard : function(e) {
		this.setState({ selectedCard: e.value}, function() {
		fetch(server + '/getValue',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "BreezecardNum": this.state.selectedCard,
         })
        }).then(response => response.json())
        .then(data => this.setState({value : data.Value}));
        });
	},
 
 	selectedStart : function(e) {
		this.setState({ selectedStart: e.value, current: {'value': e.value, 'label': e.label}}, function() {
		chosenStarting = this.state.selectedStart;
		fetch(server + '/getFare',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "Start": this.state.selectedStart,
         })
        }).then(response => response.json())
        .then(data => { console.log(this.state); 
        this.setState({fare : data.EnterFare})});
   
		fetch(server + '/endStationListData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "Start": e.value,
         })
        }).then(response => response.json())
        .then(data => this.setState({endData : data, currentE: {}})
        );
	    });
	},

	selectedEnd : function(e) {
		this.setState({ selectedEnd: e.value, currentE: {'value': e.value, 'label': e.label}}, function() {
			chosenEnding = this.state.selectedEnd;
		});
	},

	startTrip : function() {
		if(this.state.prompt == 'In Progress') {
			return;
		}
		if(this.state.selectedCard == '') {
			alert('Breezecard cannot be null');
			return;
		}
		if(this.state.value < this.state.fare) {
        	alert('Insufficient funds');
        	return;
        }
		fetch(server + '/startTrip', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "Start": this.state.current.value,
				 "BreezecardNum": this.state.selectedCard,
			})
		});
		this.setState({ prompt: 'In Progress', disable: 'true'} );
	},
	endTrip : function() {
		if(this.state.selectedStart == '' && prompt == 'Start Trip') {
			alert('Must start trip before you can end it');
			return;
		}
		fetch(server + '/endTrip', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "End": this.state.currentE.value,
				 "BreezecardNum": this.state.selectedCard,
			})
		});
		this.setState({prompt: 'Start Trip', disable: 'false'} );
	},
	nTripHistory : function() { showTripHistory(); },
	nManageCards : function() { showManageCards(); },
	nLogin : function() { showLogIn(); }
});

var ManageCards = React.createClass({
    getInitialState : function() {
    	var oColumns = [
			{
                Header: '',
                accessor: 'editButton',
                Cell: (row) => (
                    <div>
						<input type="radio" name="cardNumber" value="select" 
								onClick={() => this.selectRow(row)}/>
					</div>
                ),
                maxWidth: 40
            },
			{ Header: 'Card Number', accessor: 'BreezecardNum' },
			{ Header: 'Value', accessor: 'Value' },
			
		];
        return { columns: oColumns, data: [], selectedRow: null, card: '', value: '', credit: '' };
    },
    selectRow : function(row) {
		this.setState( {selectedRow: row.original} );
	},
	componentDidMount : function() {
		fetch(server + "/passengerCardData")
		.then(response => response.json())
		.then(data => this.setState({ data: data })
		);
	},
    render : function() { return (
    	<div class="ManageCards">
	    	<p>Manage Cards</p>
            <p>Breeze Cards</p>
            <ReactTable
				    data={this.state.data}
				    columns={this.state.columns}
					sortable={false}
					defaultPageSize={10} 
				  />
		    	<br/>
		    	<button onClick={this.removeCard}>Remove Selected Card</button>
		    	<br/>
                <input type="text" onChange={this.newCard}/>
	    	    <button onClick={this.addCard}>Add Card</button>
	    	    <br/>
	    	    <p>Add Value to Selected Card</p>
	    	    <div><label>Credit Card # </label><input type="text" onChange={this.credit}/></div>
	    	    <br/>
	    	    <div><label>Value </label><input type="text" onChange={this.newVal} /></div>
	    	    <br/>
	    	    <button onClick={this.valueChange}>Add Value</button>
	    	    <br/>
	    	    <div style={{width: "250px"}}>
                <Dropdown items={this.state.data} />
                </div>
                <br/>
		    	<button onClick={this.nPassengerFunctionality}>Back To Passenger Functionality</button>
	    	</div>
    	);
	},

	removeCard : function () {
		if(this.state.data.length == 1) {
			alert('Each passenger must have at least one Breezecard');
			return;
		} else {
			fetch(server + '/removeCard', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "BreezecardNum": this.state.selectedRow.BreezecardNum
			})
		});
		fetch(server + "/passengerCardData")
		.then(response => response.json())
		.then(data => this.setState({ data: data })
		);
		}
	},

	newCard : function(e) {
		this.setState({ card: e.target.value} );
	},

	credit : function(e) {
		this.setState({ credit: e.target.value});
	},

	newVal : function(e) {
		this.setState({ value: e.target.value} );
	},

	addCard : function() {
		if(this.state.card == '') {
			alert('Please fill out the card field');
			return;
		}
		if(this.state.credit == '') {
			alert('Must have credit card to add value');
			return;
		}
		if(this.state.card.length != 16 || this.state.credit.length != 16) {
			alert('Cards must have 16 digits');
			return;
		}
		fetch(server + '/addCard', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "BreezecardNum": this.state.card
			})
		});
	},
    
    valueChange: function() {
		fetch(server + '/addValue', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				 "Value": this.state.value,
				 "Card": this.state.selectedRow.BreezecardNum
			})
		});
	},

	nPassengerFunctionality : function() { showPassengerFunctionality(); }
});

var TripHistory = React.createClass({
    getInitialState : function() {
		var oColumns = [
			{ Header: 'Time', accessor: 'StartTime' },
            { Header: 'Source', accessor: 'StartsAt' },
            { Header: 'Destination', accessor: 'EndsAt' },
            { Header: 'Fare Paid', accessor: 'Tripfare' },
            { Header: 'Card #', accessor: 'BreezecardNum' },
		];
		return { columns: oColumns, data: [], start: '', end: ''};
	},
	
	
  	render : function() {
  		return (
	    	<div class="TripHistory">
		    <h1>Trip History</h1>
		    <div><label>Input time in the follow format of YYYY-MM-DD hh-mm-ss </label></div>
	    	<div><label>Start </label><input type="dateTime-local" onChange={this.start} value={this.state.start}/></div>
	    	<br/>
	    	<div><label>End </label><input type="dateTime-local" onChange={this.end} value={this.state.end}/></div>
	    	<br/>
	    	<button onClick={this.updateHist}>Update</button>
	    	<button onClick={this.reset}>Reset</button>
	    	<br/>
	    	<ReactTable
				data={this.state.data}
				columns={this.state.columns}
				sortable={false}
				defaultPageSize={10} 
			/>	
		    	
	    	<button onClick={this.nPassengerFunctionality}>Back to Passenger Functionality</button>
	    	</div>
    	);
	},
	componentDidMount : function() {
		this.updateHist();
	},
    start : function(e) {
		this.setState({ start: e.target.value} );
	},

	end: function(e) {
		this.setState({ end: e.target.value} );
	},

	updateHist: function() {
		fetch(server + '/updateHistory',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "Start": this.state.start,
             "End": this.state.end, 
         })
        }).then(response => response.json())
        .then(data => this.setState({data : data}));
    },

    resetData: function() {
        this.setState({ columns: oColumns, data: [], start: '', end: ''});
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
                 valueLow: '', valueHigh: '', setValue: '', transfer: '', sort: "BreezecardNum",
                 selected: breezeCardManagementOptions[0], descending: ''};
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
                <label htmlFor="suspended_checkbox"> Show Suspended Cards </label>
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
                <text style={style5}>
                    Sort Descending?
                </text>
                <input type="checkbox" name="descending_checkbox" id="descending_checkbox" onClick={this.descendingChange} />
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
    descendingChange: function(e) {
        if (e.target.checked) {
            this.setState({descending : 'DESC'});
        } else {
            this.setState({descending : ''});
        }
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
             "sort": this.state.sort,
             "desc": this.state.descending
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

const passengerFlowOptions = ['Station Name', '# Passengers In', '# Passengers Out', 'Flow', 'Revenue'];
var PassengerFlowReport = React.createClass({
    getInitialState : function() {
        var oColumns = [
            { Header: 'Station Name', accessor: 'stationName' },
            { Header: '# Passengers In', accessor: 'passIn' },
            { Header: '# Passengers Out', accessor: 'passOut' },
            { Header: 'Flow', accessor: 'flow' },
            { Header: 'Revenue', accessor: 'revenue'}
        ];
        return { columns: oColumns, data: [], descending: '', descendingCheck: false, selected: passengerFlowOptions[0], timeStart: '',
                 timeEnd: '', sort: 'stationName'};
    },
    render : function() {
        const style5 = {
            paddingRight: '5px',
            paddingBottom: '5px'
        };
        const style40 = {
            paddingRight: '40px'
        }

        const defaultOption = this.state.selected;

        return (
        <div class="PassengerFlowReport">
            <p>Passenger Flow Report</p>
            <p>
                <span style={style5}>
                    <text style={style40}>
                        Start Time
                    </text>
                    <input type="datetime-local" name="start_time_textbox" onChange={this.startChange} value={this.state.timeStart}/>
                </span>
                <span style={style5}>
                    <button onClick={this.updateData}>Update</button>
                </span>
                <button onClick={this.resetData}>Reset</button>
            </p>
            <p>
                <span style={style5}>
                    <text style={style40}>
                        End Time
                    </text>
                    <input type="datetime-local" name="end_time_textbook" onChange={this.endChange} value={this.state.timeEnd}/>
                </span>
            </p>
             <div style={{width: "250px"}}>
                <text>Order By:</text>
                <Dropdown options={passengerFlowOptions} onChange={this.sortChange} value={defaultOption} />
                <text style={style5}>
                    Sort Descending?
                </text>
                <input type="checkbox" name="descending_checkbox" id="descending_checkbox" onClick={this.descendingChange} checked={this.state.descendingCheck} />
            </div>
            <p></p>
            <ReactTable
                data={this.state.data}
                columns={this.state.columns}
                defaultPageSize={10}
                sortable={false}/>
            <button onClick={this.nAdminFunctionality}>Back</button>
        </div>
        );
    },
    componentDidMount: function() {
        this.updateData();
    },
    startChange: function(e) {
        this.setState({timeStart: e.target.value});
    },
    endChange: function(e) {
        this.setState({timeEnd: e.target.value});
    },
    descendingChange: function(e) {
        if(e.target.checked) {
            this.setState({descending: 'DESC', descendingCheck: true});
        } else {
            this.setState({descending: '', descendingCheck: false});
        }
    },
    sortChange: function(e) {
        if (e.value == passengerFlowOptions[0]) {
            this.setState({sort: "stationName"});
        } else if (e.value == passengerFlowOptions[1]) {
            this.setState({sort: "passIn"});
        } else if (e.value == passengerFlowOptions[2]) {
            this.setState({sort: "passOut"});
        } else if (e.value == passengerFlowOptions[3]) {
            this.setState({sort: 'flow'});
        } else {
            this.setState({sort: 'revenue'});
        }
        this.setState({selected: e});

    },
    updateData : function() {
        fetch(server + '/passengerFlowData',
        {method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
             "timeStart": this.state.timeStart,
             "timeEnd": this.state.timeEnd,
             "sort": this.state.sort,
             "desc": this.state.descending
         })
        }).then(function(response) {
            return response.json();
        }).then(data => this.setState({data : data}));
    },
    resetData: function() {
        this.setState({ columns: oColumns, data: [], descending: '', descendingCheck: false, selected: passengerFlowOptions[0], timeStart: '',
                 timeEnd: '', sort: 'stationName'});
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
