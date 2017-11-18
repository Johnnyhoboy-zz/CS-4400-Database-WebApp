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
    getInitialState : function() {
        this._columns = [
          { key: 'cardno', name: 'Card #', sortable: true },
          { key: 'value', name: 'Value', sortable: true },
          { key: 'owner', name: 'Owner', sortable: true }];

        let originalRows = this.createRows();
        let rows = originalRows.slice(0);
        // Store the original rows array, and make a copy that can be used for modifying eg.filtering, sorting
        return { originalRows, rows };
    },
    createRows() {
        let rows = [];
        for (let i = 1; i < 5; i++) {
          rows.push({
            cardno: i,
            value: '$' + i * 100 + '.00',
            owner: 'dootboi',
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
    render : function() {
        const style5 = {
            paddingRight: '5px',
            paddingBottom: '5px'
        };
        const style40 = {
            paddingLeft: '40px'
        }

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
                    <input type="text" name="owner_textbox" />
                </span>
                <input type="checkbox" name="suspended_checkbox" id="suspended_checkbox" />
                <label for="suspended_checkbox"> Show Suspended Cards </label>
            </p>
            <p>
                <text style={style5}>
                    Card Number:
                 </text>
                <input type="text" name="card_number_textbox" />
                <span style={style40}>
                    <button> Reset </button>
                </span>
            </p>
            <span style={style5}>
                <text style={style5}>
                    Value between:
                </text>
                <input type="text" name="value_start_textbox" size='6' />
            </span>
            <text style={style5}>
                and:
            </text>
            <input type="text" name="value_end_textbox" size='6' />
            <span style={style40}>
                    <button> Update Filter </button>
                </span>
            <p></p>
            <ReactDataGrid
                onGridSort={this.handleGridSort}
                columns={this._columns}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}/>
            <p>
                <span style={style5}>
                    <input type="text" name="card_value_textbox"/>
                </span>
                <button>Set Value of Selected Card</button>
            </p>
            <p>
                <span style={style5}>
                    <input type="text" name="transfer_card_textbox"/>
                </span>
                <button>Transfer Selected Card</button>
            </p>


            <button onClick={this.nAdminFunctionalitya}>Back</button>
    	</div>
    	);
	},
    nAdminFunctionalitya : function() { showAdminFunctionality(); }
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
    getInitialState : function() {
        this._columns = [
          { key: 'station', name: 'Station Name', sortable: true },
          { key: 'pass_in', name: '# Passengers In', sortable: true },
          { key: 'pass_out', name: '# Passengers Out', sortable: true },
          { key: 'flow', name:'Flow', sortable: true},
          { key: 'revenue', name:'Revenue', sortable:true}];

        let originalRows = this.createRows();
        let rows = originalRows.slice(0);
        // Store the original rows array, and make a copy that can be used for modifying eg.filtering, sorting
        return { originalRows, rows };
    },
    createRows() {
        let rows = [];
        for (let i = 1; i < 5; i++) {
          rows.push({
            station: 'New Donk Station',
            pass_in: i * 100,
            pass_out: i * 50,
            flow: i * 50,
            revenue: '$4.20'
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
                <ReactDataGrid
                    onGridSort={this.handleGridSort}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.rows.length}/>
            </p>
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