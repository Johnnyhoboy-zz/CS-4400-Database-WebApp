import ReactDOM from 'react-dom';
var ReactDataGrid = require('react-data-grid');

//
// The following variables define the entire screen components
// Any subcomponents meant to be reused should be defined at the specified section below
//

var LogIn = React.createClass({
    render : function() { return (
    	<div class="LogIn">
	    	<p>Log In</p>
	    	<button onClick={this.nRegistration}>Go To Registration</button>
	    	<button onClick={this.nPassengerFunctionality}>Go To Passenger Functionality</button>
	    	<button onClick={this.nAdminFunctionality}>Go To Admin Functionality</button>
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
	    	<p>Registration</p>
	    	<button onClick={this.nLogin}>Back</button>
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
    render : function() { return (
    	<div class="SuspendedCards">
	    	<p>Suspended Cards</p>
	    	<button onClick={this.nAdminFunctionality}>Back</button>
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
	    this._columns = [
	      { key: 'name', name: 'Station Name', sortable: true },
	      { key: 'id', name: 'Stop ID', sortable: true },
	      { key: 'fare', name: 'Fare', sortable: true },
	      { key: 'status', name: 'Status', sortable: true} ];

	    let originalRows = this.createRows();
	    let rows = originalRows.slice(0);
	    // Store the original rows array, and make a copy that can be used for modifying eg.filtering, sorting
	    return { originalRows, rows };
  	},
  	createRows() {
	    let rows = [];
	    for (let i = 1; i < 5; i++) {
	      rows.push({
	      	name: 'Station ' + i,
	        id: i,
	        fare: i,
	        status: 'open'
	      });
	    }
	    return rows
	  },

  rowGetter(i) {
    return this.state.rows[i];
  },
  handleGridSort(sortColumn, sortDirection) {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
      } else if (sortDirection === 'DESC') {
        return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
      }
    };

    const rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.state.rows.sort(comparer);

    this.setState({ rows });
  },
  render : function() { return (
    	<div class="StationManagement">
	    	<p>Station Management</p>
	    	<button onClick={this.nViewStation}>Go To View Station</button>
	    	<button onClick={this.nCreateStation}>Go To Create Station</button>
	    	<button onClick={this.nAdminFunctionality}>Back</button>
	    	<ReactDataGrid
	    		onGridSort={this.handleGridSort}
		        columns={this._columns}
		        rowGetter={this.rowGetter}
		        rowsCount={this.state.rows.length} />
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
	    	<p>View Station</p>
	    	<button onClick={this.nStationManagement}>Back</button>
    	</div>
    	); 
	},
	nStationManagement : function() { showStationManagement(); }
});

var CreateStation = React.createClass({
	render : function() { return (
    	<div class="CreateStation">
	    	<p>Create Station</p>
	    	<button onClick={this.nStationManagement}>Back</button>
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