import ReactDOM from 'react-dom';
import ReactTable from 'react-table';
import "react-table/react-table.css";

//
// The following variables define the entire screen components
// Any subcomponents meant to be reused should be defined at the specified section below
//

var LogIn = React.createClass({
    render : function() { return (
    	<div class="LogIn">
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
	    	<p>Passenger Functionality</p>
	    	<button onClick={this.nTripHistory}>Go To Trip History</button>
	    	<button onClick={this.nManageCards}>Go To Manage Cards</button>
	    	<button onClick={this.nLogin}>Back</button>
    	</div>
    	); 
	},
	nTripHistory : function() { showTripHistory(); },
	nManageCards : function() { showManageCards(); },
	nLogin : function() { showLogIn(); }
});

var ManageCards = React.createClass({
    render : function() { return (
    	<div class="ManageCards">
	    	<p>Manage Cards</p>
	    	<button onClick={this.nPassengerFunctionality}>Back</button>
    	</div>
    	); 
	},
	nPassengerFunctionality : function() { showPassengerFunctionality(); }
});

var TripHistory = React.createClass({
    render : function() { return (
    	<div class="TripHistory">
	    	<p>Trip History</p>
	    	<button onClick={this.nPassengerFunctionality}>Back</button>
    	</div>
    	); 
	},
	nPassengerFunctionality : function() { showPassengerFunctionality(); }
});

var AdminFunctionality = React.createClass({
    render : function() { return (
    	<div class="AdminFunctionality">
    		<center>
	    	<h1>Admin Functionality</h1>
	    	<button onClick={this.nBreezecardManagement}>Go To Breezecard Management</button> <br /> <br />
	    	<button onClick={this.nStationManagement}>Go To Station Management</button> <br /> <br />
	    	<button onClick={this.nPassengerFlowReport}>Go To PassengerFlowReport</button> <br /> <br />
	    	<button onClick={this.nSuspendedCards}>Go To Suspended Cards</button> <br /> <br />
	    	<button onClick={this.nLogin}>Back</button>
	    	</center>
    	</div>
    	);
	},
	nBreezecardManagement : function() { showBreezecardManagement(); },
	nStationManagement : function() { showStationManagement(); },
	nPassengerFlowReport : function() { showPassengerFlowReport(); },
	nSuspendedCards : function() { showSuspendedCards(); },
	nLogin : function() { showLogIn(); }
});

var BreezecardManagement = React.createClass({
    render : function() { return (
    	<div class="BreezecardManagement">
	    	<p>Breezecard Management</p>
	    	<button onClick={this.nAdminFunctionality}>Back</button>
    	</div>
    	); 
	},
	nAdminFunctionality : function() { showAdminFunctionality(); }
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
    render : function() { return (
    	<div class="PassengerFlowReport">
	    	<p>Passenger Flow Report</p>
	    	<button onClick={this.nAdminFunctionality}>Back</button>
    	</div>
    	); 
	},
	nAdminFunctionality : function() { showAdminFunctionality(); }
});

var StationManagement = React.createClass({
	getInitialState : function() {
		var oColumns = [
			{ Header: 'Station Name', accessor: 'name' },
			{ Header: 'Stop ID', accessor: 'id' },
			{ Header: 'Fare', accessor: 'fare' },
			{ Header: 'Status', accessor: 'status'}
		];
		var oData = [
			{ name: 'Sam AA', id: '1', fare: '123', status: 'open' }, 
			{ name: 'Ryan AB', id: '2', fare: '10', status: 'closed' }
		];
		return { columns: oColumns, data: oData };
	},
  	render : function() { 
  		return (
	    	<div class="StationManagement">
		    	<h1>Station Listing</h1>
		    	<ReactTable
				    data={this.state.data}
				    columns={this.state.columns}
				    defaultPageSize={10}
				  />	
		    	<button onClick={this.nViewStation}>View Station</button>
		    	<button onClick={this.nCreateStation}>Create Station</button>
		    	<br />
		    	<button onClick={this.nAdminFunctionality}>Back To Admin Functionality</button>
	    	</div>
    	);
	},
	nViewStation : function() { showViewStation(); },
	nCreateStation : function() { showCreateStation(); },
	nAdminFunctionality : function() { showAdminFunctionality(); }
});

var ViewStation = React.createClass({
    render : function() { return (
    	<div class="ViewStation">
	    	<h1>StationName (Stop StationID)</h1><br />
	    	<p>Fare</p>
	    	<input type="text" />
	    	<button>Update Fare</button>
	    	<p>Nearest Intersection: Station|Not available for Train</p>
	    	<input type="checkbox" /><label>Open Station (When checked, passengers can enter at this station)</label>
	    	<br />
	    	<br /><button onClick={this.nStationManagement}>Back to Station Management</button>
    	</div>
    	); 
	},
	nStationManagement : function() { showStationManagement(); }
});

var CreateStation = React.createClass({
	render : function() { return (
    	<div class="CreateStation">
	    	<div><label>Station Name   </label><input type="text" /></div>
	    	<div><label>Stop ID   </label><input type="text" /></div>
	    	<div><label>Entry Fare   $</label><input type="text" /></div><br />
	    	<p>Station Type</p>
	    	<form>
	    		<input type="radio" name="stationtype" value="bus" /><label>Bus</label><br />
	    		<label>Nearest Intersection</label><input type="text" /><br />
	    		<input type="radio" name="stationtype" vaue="train" /><label>Train</label>
	    	</form>
	    	<button>Create Station</button>
	    	<br /><br /><button onClick={this.nStationManagement}>Back to Station Management</button>
    	</div>
    	); 
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

function showViewStation() {
	ReactDOM.render(<ViewStation />, document.getElementById('root'));
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